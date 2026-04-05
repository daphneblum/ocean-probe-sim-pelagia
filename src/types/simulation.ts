export type ZoneId = "reef" | "open-water" | "deep-sea" | "debris-field";

export interface ZoneDefinition {
  id: ZoneId;
  name: string;
  depthRange: [number, number];
  currentDrift: number;
  signalModifier: number;
  batteryDrain: number;
  hullRisk: number;
  description: string;
  autonomousPriority: "survey" | "stabilize" | "caution";
  detections: string[];
}

export type MissionStatus =
  | "Surveying"
  | "Holding"
  | "Scanning"
  | "Returning"
  | "Surface Ready"
  | "Recharging";

export type RecoveryState = "Nominal" | "Low Power Return" | "Recharging";

export interface ProbeSystems {
  battery: number;
  depth: number;
  hullIntegrity: number;
  signalStrength: number;
  sensorStatus: "Nominal" | "Adaptive" | "Limited";
  currentZone: ZoneId;
  missionStatus: MissionStatus;
}

export interface ProbeState {
  tick: number;
  position: number;
  heading: number;
  autonomousMode: boolean;
  recoveryState: RecoveryState;
  systems: ProbeSystems;
}

export type LogCategory =
  | "system"
  | "navigation"
  | "scan"
  | "autonomy"
  | "environment";

export interface MissionLogEntry {
  id: string;
  tick: number;
  category: LogCategory;
  message: string;
}

export type DetectionKind = "biological" | "terrain" | "debris" | "unknown";

export interface RadarDetection {
  id: string;
  tick: number;
  angle: number;
  radius: number;
  x: number;
  y: number;
  kind: DetectionKind;
  logId: string;
  label: string;
  revealed: boolean;
  revealedAtMs?: number;
  expiresAtMs?: number;
}

export type SimulationAction =
  | "MOVE_FORWARD"
  | "ASCEND"
  | "DESCEND"
  | "SCAN"
  | "HOLD_POSITION"
  | "RETURN_TO_SURFACE"
  | "TOGGLE_AUTONOMY"
  | "TICK";

export interface SimulationSnapshot {
  state: ProbeState;
  logs: MissionLogEntry[];
  detections: RadarDetection[];
  latestDetection?: string;
  recommendedAction?: SimulationAction;
  disabledActions: SimulationAction[];
  sweepAngle: number;
  sensorTimeMs: number;
}
