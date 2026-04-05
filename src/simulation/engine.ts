import {
  INITIAL_PROBE_STATE,
  LOG_LIMIT,
  MAX_DEPTH,
  MAX_POSITION,
  MIN_DEPTH,
} from "@/constants/simulation";
import { ZONES } from "@/constants/zones";
import {
  MissionLogEntry,
  ProbeState,
  SimulationAction,
  SimulationSnapshot,
  ZoneDefinition,
  ZoneId,
} from "@/types/simulation";

const LOW_POWER_THRESHOLD = 28;
const CRITICAL_BATTERY_THRESHOLD = 16;
const RECOVERY_EXIT_THRESHOLD = 82;
const SURFACE_DEPTH_THRESHOLD = 20;
const AUTONOMY_IDLE_OVERHEAD = 0.04;
const MANUAL_IDLE_OVERHEAD = 0.02;

const ACTION_ENERGY_COST: Record<
  Exclude<SimulationAction, "TOGGLE_AUTONOMY" | "TICK">,
  number
> = {
  MOVE_FORWARD: 0.85,
  ASCEND: 0.55,
  DESCEND: 0.7,
  SCAN: 0.95,
  HOLD_POSITION: 0.18,
  RETURN_TO_SURFACE: 0.65,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getZoneByDepth(depth: number): ZoneDefinition {
  const exactMatch = ZONES.find(
    (zone) => depth >= zone.depthRange[0] && depth <= zone.depthRange[1],
  );

  if (exactMatch) {
    return exactMatch;
  }

  if (depth > 900) {
    return ZONES.find((zone) => zone.id === "deep-sea")!;
  }

  if (depth > 200 && depth < 950) {
    return ZONES.find((zone) => zone.id === "debris-field")!;
  }

  return ZONES.find((zone) => zone.id === "open-water")!;
}

function zoneById(zoneId: ZoneId) {
  return ZONES.find((zone) => zone.id === zoneId)!;
}

function createLog(
  tick: number,
  category: MissionLogEntry["category"],
  message: string,
): MissionLogEntry {
  return {
    id: `${tick}-${category}-${message}`,
    tick,
    category,
    message,
  };
}

function appendLogs(
  existing: MissionLogEntry[],
  additions: MissionLogEntry[],
): MissionLogEntry[] {
  return [...existing, ...additions].slice(-LOG_LIMIT);
}

function resolveSensorStatus(signalStrength: number, depth: number) {
  if (signalStrength < 38 || depth > 1100) {
    return "Limited" as const;
  }

  if (signalStrength < 62 || depth > 650) {
    return "Adaptive" as const;
  }

  return "Nominal" as const;
}

function deterministicDetection(zone: ZoneDefinition, tick: number) {
  return zone.detections[tick % zone.detections.length];
}

function isAtSurface(depth: number) {
  return depth <= SURFACE_DEPTH_THRESHOLD;
}

function getDisabledActions(state: ProbeState): SimulationAction[] {
  if (state.recoveryState !== "Recharging") {
    return [];
  }

  return ["MOVE_FORWARD", "DESCEND", "SCAN"];
}

function getRecommendedAction(state: ProbeState): SimulationAction | undefined {
  if (state.recoveryState === "Recharging") {
    return undefined;
  }

  if (state.systems.battery <= CRITICAL_BATTERY_THRESHOLD && !isAtSurface(state.systems.depth)) {
    return "RETURN_TO_SURFACE";
  }

  if (state.systems.battery <= LOW_POWER_THRESHOLD) {
    return "RETURN_TO_SURFACE";
  }

  return undefined;
}

function applyPassiveChanges(state: ProbeState): ProbeState {
  const zone = getZoneByDepth(state.systems.depth);
  const recharging = state.recoveryState === "Recharging";
  const batteryDelta = recharging
    ? 1.35
    : -(zone.batteryDrain + (state.autonomousMode ? AUTONOMY_IDLE_OVERHEAD : MANUAL_IDLE_OVERHEAD));
  const signalStrength = clamp(
    (recharging ? 98 : 94) + zone.signalModifier - state.systems.depth * 0.03,
    18,
    100,
  );
  const hullPenalty = recharging
    ? 0
    :
    zone.hullRisk * (state.systems.depth > 800 ? 0.18 : 0.08) +
    (zone.id === "debris-field" ? 0.12 : 0);
  const battery = clamp(state.systems.battery + batteryDelta, 0, 100);
  const recoveredFromRecharge =
    recharging && battery >= RECOVERY_EXIT_THRESHOLD;
  const nextRecoveryState = recharging
    ? recoveredFromRecharge
      ? "Nominal"
      : "Recharging"
    : battery <= LOW_POWER_THRESHOLD
      ? "Low Power Return"
      : state.recoveryState;
  const nextMissionStatus = recharging
    ? "Recharging"
    : recoveredFromRecharge
      ? "Holding"
      : state.systems.missionStatus;

  return {
    ...state,
    tick: state.tick + 1,
    position: clamp(
      state.position + (recharging ? 0 : zone.currentDrift),
      0,
      MAX_POSITION,
    ),
    recoveryState: nextRecoveryState,
    systems: {
      ...state.systems,
      battery,
      hullIntegrity: clamp(state.systems.hullIntegrity - hullPenalty, 0, 100),
      signalStrength,
      sensorStatus: resolveSensorStatus(signalStrength, state.systems.depth),
      currentZone: zone.id,
      missionStatus: nextMissionStatus,
    },
  };
}

function applyActionToState(state: ProbeState, action: SimulationAction): ProbeState {
  const disabledActions = getDisabledActions(state);

  if (disabledActions.includes(action)) {
    return {
      ...state,
      systems: {
        ...state.systems,
        missionStatus: "Recharging",
      },
    };
  }

  switch (action) {
    case "MOVE_FORWARD":
      return {
        ...state,
        position: clamp(state.position + 14, 0, MAX_POSITION),
        systems: {
          ...state.systems,
          battery: clamp(
            state.systems.battery - ACTION_ENERGY_COST.MOVE_FORWARD,
            0,
            100,
          ),
          missionStatus: "Surveying",
        },
      };
    case "ASCEND":
      return {
        ...state,
        systems: {
          ...state.systems,
          depth: clamp(state.systems.depth - 70, MIN_DEPTH, MAX_DEPTH),
          battery: clamp(
            state.systems.battery - ACTION_ENERGY_COST.ASCEND,
            0,
            100,
          ),
          missionStatus:
            state.systems.depth <= 90 ? "Surface Ready" : "Surveying",
        },
      };
    case "DESCEND":
      return {
        ...state,
        systems: {
          ...state.systems,
          depth: clamp(state.systems.depth + 95, MIN_DEPTH, MAX_DEPTH),
          battery: clamp(
            state.systems.battery - ACTION_ENERGY_COST.DESCEND,
            0,
            100,
          ),
          missionStatus: "Surveying",
        },
      };
    case "SCAN":
      return {
        ...state,
        systems: {
          ...state.systems,
          battery: clamp(
            state.systems.battery - ACTION_ENERGY_COST.SCAN,
            0,
            100,
          ),
          missionStatus: "Scanning",
        },
      };
    case "HOLD_POSITION":
      return {
        ...state,
        systems: {
          ...state.systems,
          battery: clamp(
            state.systems.battery - ACTION_ENERGY_COST.HOLD_POSITION,
            0,
            100,
          ),
          missionStatus: "Holding",
        },
      };
    case "RETURN_TO_SURFACE":
      const surfacedDepth = clamp(state.systems.depth - 180, MIN_DEPTH, MAX_DEPTH);
      const surfaced = isAtSurface(surfacedDepth);
      return {
        ...state,
        autonomousMode: true,
        recoveryState: surfaced ? "Recharging" : "Low Power Return",
        systems: {
          ...state.systems,
          depth: surfacedDepth,
          battery: clamp(
            state.systems.battery - ACTION_ENERGY_COST.RETURN_TO_SURFACE,
            0,
            100,
          ),
          missionStatus: surfaced ? "Recharging" : "Returning",
        },
      };
    case "TOGGLE_AUTONOMY":
      if (state.recoveryState === "Recharging") {
        return state;
      }

      return {
        ...state,
        autonomousMode: !state.autonomousMode,
      };
    case "TICK":
      return state;
  }
}

function actionLogMessage(
  action: SimulationAction,
  zone: ZoneDefinition,
  state: ProbeState,
) {
  switch (action) {
    case "MOVE_FORWARD":
      return `Survey track advanced 14 m through ${zone.name.toLowerCase()} water.`;
    case "ASCEND":
      return `Controlled ascent initiated. Depth now ${state.systems.depth.toFixed(0)} m.`;
    case "DESCEND":
      return `Vehicle committed to deeper water. Depth now ${state.systems.depth.toFixed(0)} m.`;
    case "SCAN":
      return `Active sonar sweep completed in ${zone.name.toLowerCase()} water.`;
    case "HOLD_POSITION":
      return `Station-keeping held against ${zone.currentDrift.toFixed(1)} kn estimated drift.`;
    case "RETURN_TO_SURFACE":
      return `Recovery ascent initiated. Relay depth target ${state.systems.depth.toFixed(0)} m.`;
    case "TOGGLE_AUTONOMY":
      return "Autonomy state updated.";
    case "TICK":
      return "Telemetry cycle complete.";
  }
}

function getAutonomousAction(state: ProbeState): SimulationAction {
  if (state.recoveryState === "Recharging") {
    return "HOLD_POSITION";
  }

  if (state.systems.battery < CRITICAL_BATTERY_THRESHOLD || state.systems.hullIntegrity < 45) {
    return "RETURN_TO_SURFACE";
  }

  if (state.systems.signalStrength < 35) {
    return "ASCEND";
  }

  if (state.systems.currentZone === "debris-field" && state.tick % 2 === 0) {
    return "SCAN";
  }

  if (state.systems.currentZone === "deep-sea" && state.tick % 3 === 0) {
    return "HOLD_POSITION";
  }

  return state.tick % 2 === 0 ? "MOVE_FORWARD" : "SCAN";
}

export function createInitialSnapshot(): SimulationSnapshot {
  return {
    state: INITIAL_PROBE_STATE,
    logs: [
      createLog(
        0,
        "system",
        "Pelagia initialized. Vehicle stable and awaiting command.",
      ),
    ],
    disabledActions: [],
  };
}

export function stepSimulation(
  snapshot: SimulationSnapshot,
  requestedAction: SimulationAction,
): SimulationSnapshot {
  let workingState = applyPassiveChanges(snapshot.state);
  const logs: MissionLogEntry[] = [];
  const disabledActions = getDisabledActions(workingState);

  const chosenAction =
    requestedAction === "TICK" && workingState.autonomousMode
      ? getAutonomousAction(workingState)
      : requestedAction;

  if (requestedAction === "TOGGLE_AUTONOMY") {
    if (workingState.recoveryState === "Recharging") {
      logs.push(
        createLog(
          workingState.tick,
          "system",
          "Autonomy setting held. Surface recharge sequence remains in effect.",
        ),
      );
    } else {
      workingState = applyActionToState(workingState, requestedAction);
      logs.push(
        createLog(
          workingState.tick,
          "autonomy",
          `Autonomous control ${workingState.autonomousMode ? "engaged" : "disengaged"}.`,
        ),
      );
    }
  } else {
    workingState = applyActionToState(workingState, chosenAction);
    const zone = getZoneByDepth(workingState.systems.depth);
    if (disabledActions.includes(chosenAction)) {
      logs.push(
        createLog(
          workingState.tick,
          "system",
          `Command ${chosenAction.toLowerCase().replaceAll("_", " ")} deferred. Surface recharge sequence limits propulsion and scan load.`,
        ),
      );
    } else if (chosenAction !== "TICK") {
      logs.push(
        createLog(
          workingState.tick,
          chosenAction === "SCAN" ? "scan" : "navigation",
          actionLogMessage(chosenAction, zone, workingState),
        ),
      );
    }

    if (workingState.autonomousMode && requestedAction === "TICK") {
      logs.push(
        createLog(
          workingState.tick,
          "autonomy",
          workingState.recoveryState === "Low Power Return"
            ? "Autonomy selected return to surface on critical battery reserve."
            : `Autonomy selected ${chosenAction
                .toLowerCase()
                .replaceAll("_", " ")} based on current vehicle state.`,
        ),
      );
    }

    if (chosenAction === "SCAN") {
      logs.push(
        createLog(
          workingState.tick,
          "environment",
          deterministicDetection(zone, workingState.tick),
        ),
      );
    }
  }

  const finalZone = getZoneByDepth(workingState.systems.depth);
  workingState = {
    ...workingState,
    recoveryState:
      workingState.recoveryState === "Low Power Return" &&
      isAtSurface(workingState.systems.depth)
        ? "Recharging"
        : workingState.recoveryState,
    systems: {
      ...workingState.systems,
      currentZone: finalZone.id,
      sensorStatus: resolveSensorStatus(
        workingState.systems.signalStrength,
        workingState.systems.depth,
      ),
      missionStatus:
        workingState.recoveryState === "Recharging"
          ? "Recharging"
          : workingState.systems.depth <= SURFACE_DEPTH_THRESHOLD &&
              chosenAction === "RETURN_TO_SURFACE"
            ? "Surface Ready"
          : workingState.systems.missionStatus,
    },
  };

  const statusNotes: MissionLogEntry[] = [];
  if (finalZone.id !== snapshot.state.systems.currentZone) {
    statusNotes.push(
      createLog(
        workingState.tick,
        "environment",
        `Entered ${zoneById(finalZone.id).name.toLowerCase()} conditions at ${workingState.systems.depth.toFixed(0)} m.`,
      ),
    );
  }

  if (
    snapshot.state.systems.battery > LOW_POWER_THRESHOLD &&
    workingState.systems.battery <= LOW_POWER_THRESHOLD
  ) {
    statusNotes.push(
      createLog(
        workingState.tick,
        "system",
        `Battery reserve below ${LOW_POWER_THRESHOLD}%. Return-to-surface profile recommended.`,
      ),
    );
  }

  if (
    snapshot.state.systems.battery > CRITICAL_BATTERY_THRESHOLD &&
    workingState.systems.battery <= CRITICAL_BATTERY_THRESHOLD
  ) {
    statusNotes.push(
      createLog(
        workingState.tick,
        "system",
        `Battery reserve critical at ${workingState.systems.battery.toFixed(0)}%. Recovery ascent required.`,
      ),
    );
  }

  if (
    snapshot.state.recoveryState !== "Recharging" &&
    workingState.recoveryState === "Recharging"
  ) {
    statusNotes.push(
      createLog(
        workingState.tick,
        "system",
        "Vehicle stabilized at surface depth. Recharge cycle initiated; propulsion and active scan loads restricted.",
      ),
    );
  }

  if (
    snapshot.state.recoveryState === "Recharging" &&
    workingState.recoveryState === "Recharging"
  ) {
    statusNotes.push(
      createLog(
        workingState.tick,
        "system",
        `Battery recovery underway at ${workingState.systems.battery.toFixed(0)}%. Vehicle held in low-load surface state.`,
      ),
    );
  }

  if (
    snapshot.state.recoveryState === "Recharging" &&
    workingState.recoveryState === "Nominal"
  ) {
    statusNotes.push(
      createLog(
        workingState.tick,
        "system",
        `Recharge cycle complete at ${workingState.systems.battery.toFixed(0)}%. Full survey capability restored.`,
      ),
    );
  }

  if (workingState.systems.signalStrength < 40) {
    statusNotes.push(
      createLog(
        workingState.tick,
        "system",
        `Link margin reduced to ${workingState.systems.signalStrength.toFixed(0)}%. Signal attenuation increasing.`,
      ),
    );
  }

  if (workingState.systems.battery < 30) {
    statusNotes.push(
      createLog(
        workingState.tick,
        "system",
        `Battery reserve at ${workingState.systems.battery.toFixed(0)}%. Reduced-power profile advised.`,
      ),
    );
  }

  return {
    state: workingState,
    logs: appendLogs(snapshot.logs, [...logs, ...statusNotes]),
    latestDetection:
      chosenAction === "SCAN"
        ? deterministicDetection(finalZone, workingState.tick)
        : snapshot.latestDetection,
    recommendedAction: getRecommendedAction(workingState),
    disabledActions: getDisabledActions(workingState),
  };
}
