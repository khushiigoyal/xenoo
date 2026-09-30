import { Train, TrainStop, FeatureAttribution, OperationalEvent, TrainStatus, SignalAspect } from '../types/railway';

/**
 * Utility: Add minutes to an HH:mm format time string
 */
export function addMinutesToTimeString(timeStr: string, minutesToAdd: number): string {
  if (!timeStr || !timeStr.includes(':')) return timeStr;
  const [hoursStr, minsStr] = timeStr.split(':');
  let hours = parseInt(hoursStr, 10);
  let mins = parseInt(minsStr, 10);

  if (isNaN(hours) || isNaN(mins)) return timeStr;

  let totalMinutes = hours * 60 + mins + Math.round(minutesToAdd);
  // Ensure non-negative and handle day wrap
  while (totalMinutes < 0) totalMinutes += 24 * 60;
  totalMinutes = totalMinutes % (24 * 60);

  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;

  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

/**
 * Calculates the ETA and downstream progression for a train given its operational context.
 * Structured to mirror an XGBoost / Gradient Boosting Regressor feature pipeline.
 */
export function recalculateTrainETA(
  train: Train,
  eventsOverride?: OperationalEvent[]
): Train {
  const events = eventsOverride !== undefined ? eventsOverride : train.activeEvents;

  // 1. Calculate event impact sum
  let signalImpact = 0;
  let congestionImpact = 0;
  let weatherImpact = 0;
  let unscheduledStopImpact = 0;
  let droneImpact = 0;
  let generalDelayImpact = 0;

  events.forEach(evt => {
    switch (evt.type) {
      case 'SIGNAL':
        signalImpact += evt.impactMinutes;
        break;
      case 'CONGESTION':
        congestionImpact += evt.impactMinutes;
        break;
      case 'WEATHER':
        weatherImpact += evt.impactMinutes;
        break;
      case 'UNSCHEDULED_STOP':
        unscheduledStopImpact += evt.impactMinutes;
        break;
      case 'DRONE':
        droneImpact += evt.impactMinutes;
        break;
      case 'DELAY':
      default:
        generalDelayImpact += evt.impactMinutes;
        break;
    }
  });

  const totalEventImpact = signalImpact + congestionImpact + weatherImpact + unscheduledStopImpact + droneImpact + generalDelayImpact;

  // Base delay before dynamic events
  const baseDelay = train.currentDelayMinutes;
  const totalPredictedDelay = baseDelay + totalEventImpact;

  // Signal aspect logic based on events
  let signalStatus: SignalAspect = 'GREEN';
  if (signalImpact > 0 || unscheduledStopImpact > 0) {
    signalStatus = 'RED';
  } else if (congestionImpact > 0 || droneImpact > 0) {
    signalStatus = 'DOUBLE_YELLOW';
  } else if (weatherImpact > 0 || totalPredictedDelay > 15) {
    signalStatus = 'YELLOW';
  }

  // Train status pill
  let status: TrainStatus = 'ON_TIME';
  if (totalPredictedDelay >= 15) {
    status = 'CRITICAL_DELAY';
  } else if (totalPredictedDelay > 5) {
    status = 'SLIGHT_DELAY';
  } else {
    status = 'ON_TIME';
  }

  // Dynamic Confidence Scoring:
  // Decays with high variance, severe weather, and large delay deviations
  let confidence = 96;
  if (totalPredictedDelay > 0) {
    confidence -= Math.min(25, Math.floor(totalPredictedDelay * 0.7));
  }
  if (weatherImpact > 0) confidence -= 8;
  if (signalImpact > 0) confidence -= 5;
  if (droneImpact > 0) confidence -= 4; // Temporary restriction until cleared
  confidence = Math.max(55, Math.min(99, confidence));

  // Current speed adjustments based on active conditions
  let currentSpeed = train.maxPermissibleSpeedKmH * 0.82;
  if (signalStatus === 'RED') {
    currentSpeed = 0; // Stopped
  } else if (signalStatus === 'YELLOW') {
    currentSpeed = Math.min(currentSpeed, 45);
  } else if (signalStatus === 'DOUBLE_YELLOW') {
    currentSpeed = Math.min(currentSpeed, 65);
  } else if (weatherImpact > 0) {
    currentSpeed = Math.min(currentSpeed, 60);
  }

  // Build Explainable AI rationale
  const rationaleParts: string[] = [];
  if (baseDelay > 0) rationaleParts.push(`Inherited prior corridor delay (+${baseDelay} min)`);
  if (generalDelayImpact > 0) rationaleParts.push(`Operational delay event (+${generalDelayImpact} min)`);
  if (signalImpact > 0) rationaleParts.push(`Signal aspect caution order (+${signalImpact} min)`);
  if (congestionImpact > 0) rationaleParts.push(`Block section occupancy / headway slowdown (+${congestionImpact} min)`);
  if (unscheduledStopImpact > 0) rationaleParts.push(`Unscheduled loop line hold (+${unscheduledStopImpact} min)`);
  if (weatherImpact > 0) rationaleParts.push(`Visibility restriction (Fog/Rain MPS capped at 60 km/h) (+${weatherImpact} min)`);
  if (droneImpact > 0) rationaleParts.push(`Drone aerial anomaly: Caution order issued (+${droneImpact} min)`);

  const rationale = rationaleParts.length > 0 
    ? rationaleParts.join('; ') + '.'
    : 'Corridor operations nominal. Track clearance green wave active.';

  const featureAttribution: FeatureAttribution = {
    baseRunningDelay: baseDelay + generalDelayImpact,
    signalRestriction: signalImpact,
    trackCongestion: congestionImpact,
    scheduledDwellDelta: unscheduledStopImpact,
    weatherFactor: weatherImpact,
    droneCautionOrder: droneImpact,
    totalPredictedDelay,
    confidence,
    rationale
  };

  // Recalculate downstream station stops
  // Cumulative delay ripple: delay propagates to next stations, but high speed recovery can shave 1-2 min over long distances
  let cumulativeAddedDelay = totalPredictedDelay;

  const updatedStops: TrainStop[] = train.stops.map((stop, idx) => {
    if (stop.status === 'departed') {
      return stop; // Past stations keep historical actual arrival/departure
    }

    // Downstream stations suffer from cumulative delay
    // If distance is far, recovery buffer might reduce delay slightly if train type is Rajdhani/Vande Bharat
    let stationDelay = cumulativeAddedDelay;
    if (train.type === 'Vande Bharat' || train.type === 'Rajdhani') {
      const bufferShave = Math.min(3, Math.floor(idx * 0.8));
      stationDelay = Math.max(0, stationDelay - bufferShave);
    }

    // Station specific historical bottleneck variance
    const stationVariance = stop.historicalVarianceMin > 2.5 ? 1 : 0;
    const finalStopDelay = stationDelay + stationVariance;

    const newPredictedArrival = addMinutesToTimeString(stop.scheduledArrival, finalStopDelay);
    const newPredictedDeparture = addMinutesToTimeString(stop.scheduledDeparture, finalStopDelay);

    // Stop confidence decays slightly for stations further down the line
    const stopConfidence = Math.max(50, confidence - (idx * 2));

    return {
      ...stop,
      predictedArrival: newPredictedArrival,
      predictedDeparture: newPredictedDeparture,
      delayMinutes: finalStopDelay,
      confidence: stopConfidence
    };
  });

  // Next station ETA
  const nextStop = updatedStops.find(s => s.status === 'next') || updatedStops[updatedStops.length - 1];

  return {
    ...train,
    currentSpeedKmH: Math.round(currentSpeed),
    currentDelayMinutes: totalPredictedDelay,
    predictedArrivalNext: nextStop ? nextStop.predictedArrival : train.predictedArrivalNext,
    scheduledArrivalNext: nextStop ? nextStop.scheduledArrival : train.scheduledArrivalNext,
    confidencePercentage: confidence,
    status,
    signalStatus,
    stops: updatedStops,
    featureAttribution,
    activeEvents: events
  };
}

/**
 * Creates simulated operational delay events for user demo interactions.
 */
export function createSimulationEvent(
  type: 'DELAY' | 'SIGNAL' | 'CONGESTION' | 'UNSCHEDULED_STOP' | 'WEATHER' | 'DRONE',
  trainNumber: string,
  sectionLocation: string,
  customMinutes?: number,
  customTitle?: string,
  customDescription?: string
): OperationalEvent {
  const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false });
  const id = `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  switch (type) {
    case 'DELAY':
      return {
        id,
        title: customTitle || `Major Operational Delay (+${customMinutes ?? 20} min)`,
        type: 'DELAY',
        location: sectionLocation,
        impactMinutes: customMinutes ?? 20,
        timestamp,
        description: customDescription || 'Locomotive power unit auxiliary trip and headway clearance delay.',
        severity: (customMinutes ?? 20) >= 15 ? 'CRITICAL' : 'HIGH',
        trainNumber
      };
    case 'SIGNAL':
      return {
        id,
        title: customTitle || `Signal Restriction & Aspect Failure (+${customMinutes ?? 7} min)`,
        type: 'SIGNAL',
        location: sectionLocation,
        impactMinutes: customMinutes ?? 7,
        timestamp,
        description: customDescription || 'Auto-signaling block occupancy glitch; pilot running under paper line clear order at 15 km/h.',
        severity: 'HIGH',
        trainNumber
      };
    case 'CONGESTION':
      return {
        id,
        title: customTitle || `Track Congestion Ahead (+${customMinutes ?? 12} min)`,
        type: 'CONGESTION',
        location: sectionLocation,
        impactMinutes: customMinutes ?? 12,
        timestamp,
        description: customDescription || 'Heavy freight train preceding in block section. Headway spacing enforced.',
        severity: 'MEDIUM',
        trainNumber
      };
    case 'UNSCHEDULED_STOP':
      return {
        id,
        title: customTitle || `Unscheduled Halt on Loop Line (+${customMinutes ?? 15} min)`,
        type: 'UNSCHEDULED_STOP',
        location: sectionLocation,
        impactMinutes: customMinutes ?? 15,
        timestamp,
        description: customDescription || 'Train held on outer loop line for Rajdhani precedence clearance.',
        severity: 'HIGH',
        trainNumber
      };
    case 'WEATHER':
      return {
        id,
        title: customTitle || `Dense Fog & Low Visibility (+${customMinutes ?? 18} min)`,
        type: 'WEATHER',
        location: sectionLocation,
        impactMinutes: customMinutes ?? 18,
        timestamp,
        description: customDescription || 'Visibility below 100 meters. Fog pilot safety rules active (max 60 km/h with detonators).',
        severity: 'HIGH',
        trainNumber
      };
    case 'DRONE':
      return {
        id,
        title: customTitle || `Drone Anomaly Alert: Track Obstruction (+${customMinutes ?? 10} min)`,
        type: 'DRONE',
        location: sectionLocation,
        impactMinutes: customMinutes ?? 10,
        timestamp,
        description: customDescription || 'Physical drone DR-01 detected foreign object/track ballast debris near km marker. Caution order 30 km/h issued.',
        severity: 'HIGH',
        trainNumber
      };
  }
}
