import { ProbeState } from "@/types/simulation";

export const MAX_DEPTH = 1800;
export const MIN_DEPTH = 0;
export const MAX_POSITION = 1000;
export const LOG_LIMIT = 18;

export const INITIAL_PROBE_STATE: ProbeState = {
  tick: 0,
  position: 0,
  heading: 90,
  autonomousMode: false,
  recoveryState: "Nominal",
  systems: {
    battery: 100,
    depth: 85,
    hullIntegrity: 100,
    signalStrength: 94,
    sensorStatus: "Nominal",
    currentZone: "reef",
    missionStatus: "Holding",
  },
};
