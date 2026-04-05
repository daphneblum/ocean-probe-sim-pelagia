import { Panel, StatPill } from "@/components/ui";
import { ProbeState } from "@/types/simulation";

function toneForPercent(value: number) {
  if (value < 35) return "danger" as const;
  if (value < 60) return "warning" as const;
  return "default" as const;
}

export function ProbeSystemsPanel({ state }: { state: ProbeState }) {
  return (
    <Panel
      title="Probe Systems"
      subtitle="Primary vehicle telemetry for power, structure, and link condition."
      className="h-full"
      headerRight={
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-slate-300">
          {state.systems.missionStatus}
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <StatPill
          label="Battery"
          value={`${state.systems.battery.toFixed(0)}%`}
          tone={toneForPercent(state.systems.battery)}
        />
        <StatPill label="Depth" value={`${state.systems.depth.toFixed(0)} m`} />
        <StatPill
          label="Hull Integrity"
          value={`${state.systems.hullIntegrity.toFixed(0)}%`}
          tone={toneForPercent(state.systems.hullIntegrity)}
        />
        <StatPill
          label="Signal Strength"
          value={`${state.systems.signalStrength.toFixed(0)}%`}
          tone={toneForPercent(state.systems.signalStrength)}
        />
        <StatPill label="Sensor Status" value={state.systems.sensorStatus} />
        <StatPill label="Recovery State" value={state.recoveryState} />
        <StatPill label="Current Zone" value={state.systems.currentZone} />
      </div>
    </Panel>
  );
}
