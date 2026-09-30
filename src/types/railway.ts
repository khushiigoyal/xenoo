export type TrainStatus = 'ON_TIME' | 'SLIGHT_DELAY' | 'CRITICAL_DELAY';
export type StopStatus = 'departed' | 'current' | 'next' | 'upcoming';
export type SignalAspect = 'GREEN' | 'DOUBLE_YELLOW' | 'YELLOW' | 'RED';
export type EventSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AssetStatus = 'GOOD' | 'WARNING' | 'CRITICAL';
export type BlockStatus = 'PLANNED' | 'ACTIVE' | 'CLEARED';

export interface Station {
  code: string;
  name: string;
  division: string;
  zone: string;
  kmMarker: number;
  isJunction: boolean;
  platforms: number;
  averageDelayImpactMin: number;
  historicalPunctualityScore: number;
}

export interface TrainStop {
  stationCode: string;
  stationName: string;
  scheduledArrival: string;
  scheduledDeparture: string;
  predictedArrival: string;
  predictedDeparture: string;
  delayMinutes: number;
  confidence: number;
  status: StopStatus;
  platform: string;
  distanceFromStartKm: number;
  historicalVarianceMin: number;
}

export interface FeatureAttribution {
  baseRunningDelay: number;
  signalRestriction: number;
  trackCongestion: number;
  scheduledDwellDelta: number;
  weatherFactor: number;
  droneCautionOrder: number;
  totalPredictedDelay: number;
  confidence: number;
  rationale: string;
}

export interface OperationalEvent {
  id: string;
  title: string;
  type: 'DELAY' | 'SIGNAL' | 'CONGESTION' | 'UNSCHEDULED_STOP' | 'WEATHER' | 'DRONE';
  location: string;
  impactMinutes: number;
  timestamp: string;
  description: string;
  severity: EventSeverity;
  trainNumber?: string;
}

export interface RailwayAsset {
  id: string;
  name: string;
  category: 'OHE_CATENARY' | 'SIGNALING' | 'TRACK_STRUCTURE' | 'TRACTION_POWER' | 'POINT_MACHINE';
  location: string;
  railKm: string;
  status: AssetStatus;
  healthScore: number; // 0 - 100
  lastInspection: string;
  nextScheduledMaintenance: string;
  telemetryMetric: string;
  notes: string;
}

export interface RailwayBlock {
  id: string;
  trackCode: string;
  title: string;
  reason: string;
  section: string;
  railKm: string;
  startTime: string;
  endTime: string;
  status: BlockStatus;
  affectedTrainNumbers: string[];
  impactMinutes: number;
  bypassRouteAvailable: boolean;
  approvedByController: boolean;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  type: 'Vande Bharat' | 'Rajdhani' | 'Shatabdi' | 'Express' | 'Duronto';
  source: string;
  destination: string;
  currentStation: string;
  nextStation: string;
  currentSpeedKmH: number;
  maxPermissibleSpeedKmH: number;
  currentDelayMinutes: number;
  scheduledArrivalNext: string;
  predictedArrivalNext: string;
  confidencePercentage: number;
  status: TrainStatus;
  progressPercent: number; // 0 to 100 along route
  signalStatus: SignalAspect;
  locoType: string;
  rakeComposition: string;
  stops: TrainStop[];
  featureAttribution: FeatureAttribution;
  activeEvents: OperationalEvent[];
}

export interface DroneFeedData {
  id: string;
  callsign: string;
  locationName: string;
  corridor: string;
  railKm: string;
  coordinates: { lat: number; lng: number };
  altitudeMeters: number;
  speedKmH: number;
  batteryPercent: number;
  connectionStatus: 'LIVE' | 'STANDBY' | 'TRANSMITTING';
  gpsLock: boolean;
  cameraResolution: string;
  aiEventStatus: string;
  lastAnomalyDetected?: {
    title: string;
    confidence: number;
    type: 'OBSTRUCTION' | 'TRACK_WORK' | 'INSPECTION_CLEAR' | 'CATTLE_HAZARD';
    railKm: string;
    detectedAt: string;
    impactDescription: string;
  };
}

export interface PassengerNotification {
  id: string;
  trainNumber: string;
  trainName: string;
  stationName: string;
  message: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  timestamp: string;
  revisedEta?: string;
  originalEta?: string;
}

export interface PassengerProfile {
  id: string;
  name: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  sourceCode: string;
  destinationCode: string;
  journeyDate: string;
  coach: string;
  berth: string;
  berthType: string;
  bookingStatus: 'CONFIRMED' | 'RAC' | 'WL';
  mobileNumber: string;
  email: string;
  irctcUsername?: string;
  authMethod: 'PNR' | 'IRCTC' | 'OTP' | 'DIGIYATRA' | 'GUEST';
  platform?: string;
  alertsEnabled: {
    sms: boolean;
    whatsapp: boolean;
    voiceCall: boolean;
    appPush: boolean;
  };
}

export interface OperationsAlert {
  id: string;
  title: string;
  severity: EventSeverity;
  affectedTrain: string;
  section: string;
  timestamp: string;
  recommendedAction: string;
  confidenceImpact: string;
}

export interface HistoricalAnalytics {
  maeMinutes: number;
  rmseMinutes: number;
  medianAbsoluteError: number;
  withinFiveMinutesPercent: number;
  withinTenMinutesPercent: number;
  avgRecalculationLatencyMs: number;
  totalPredictionsToday: number;
  historicalErrorDistribution: { bucket: string; count: number; percentage: number }[];
  stationDelayIntelligence: {
    stationCode: string;
    stationName: string;
    avgDelayImpactMin: number;
    delayType: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    dwellVarianceSec: number;
  }[];
  modelPerformanceByCorridor: {
    corridor: string;
    mae: number;
    sampleSize: number;
    accuracy: number;
  }[];
}
