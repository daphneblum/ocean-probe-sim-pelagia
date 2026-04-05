import { Panel } from "@/components/ui";
import { ZONES } from "@/constants/zones";
import { ProbeState } from "@/types/simulation";

export function EnvironmentPanel({
  state,
  latestDetection,
}: {
  state: ProbeState;
  latestDetection?: string;
}) {
  const activeZone = ZONES.find((zone) => zone.id === state.systems.currentZone)!;

  return (
    <Panel
      title="Environment"
      subtitle="Current water mass, operating envelope, and latest contact."
      className="h-full"
    >
      <div className="rounded-[1.3rem] border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(54,192,220,0.12),_transparent_55%),rgba(255,255,255,0.03)] p-4">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
          Active Zone
        </p>
        <h4 className="mt-2 font-serif text-[1.7rem] text-white">
          {activeZone.name}
        </h4>
        <p className="mt-2.5 text-sm leading-6 text-slate-300">
          {activeZone.description}
        </p>
      </div>
      <div className="mt-4 grid gap-3 grid-cols-3">
        <div className="rounded-[1.15rem] border border-white/10 bg-white/5 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
            Depth Band
          </p>
          <p className="mt-1.5 text-sm text-white">
            {activeZone.depthRange[0]}-{activeZone.depthRange[1]} m
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-white/10 bg-white/5 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
            Local Drift
          </p>
          <p className="mt-1.5 text-sm text-white">
            {activeZone.currentDrift.toFixed(1)} kn est.
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-white/10 bg-white/5 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
            Signal Modifier
          </p>
          <p className="mt-1.5 text-sm text-white">
            {activeZone.signalModifier > 0 ? "+" : ""}
            {activeZone.signalModifier}
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-[1.2rem] border border-cyan-300/20 bg-cyan-300/10 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">
          Latest Contact
        </p>
        <p className="mt-2 text-sm leading-6 text-cyan-50">
          {latestDetection ??
            "No contact logged. Run a scan to populate the contact summary."}
        </p>
      </div>
    </Panel>
  );
}
