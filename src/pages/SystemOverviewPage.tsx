import { Panel, SectionHeading } from "@/components/ui";
import { ZONES } from "@/constants/zones";
import { decisionRules, systemsDescriptions } from "@/data/overviewContent";

export function SystemOverviewPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="System Overview"
        title="A compact simulation model with explicit operating rules."
        description="Zone definitions, probe state, and time-step updates are all fixed in code. Each change shown in the console follows from those rules rather than from chance or external services."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Ocean Zones"
          subtitle="Each zone defines its own depth band, drift, signal penalty, and expected contacts."
        >
          <div className="space-y-4">
            {ZONES.map((zone) => (
              <div
                key={zone.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-serif text-xl text-white">{zone.name}</h3>
                  <span className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    {zone.depthRange[0]}-{zone.depthRange[1]} m
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {zone.description}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Autonomous Decision Rules"
          subtitle="The vehicle follows a short set of priorities when autonomy is enabled."
        >
          <div className="space-y-3">
            {decisionRules.map((rule) => (
              <div
                key={rule}
                className="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 px-4 py-3 text-sm leading-6 text-slate-200"
              >
                {rule}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel
          title="Onboard Systems"
          subtitle="Each readout on the console maps directly to probe state."
        >
          <div className="space-y-4">
            {systemsDescriptions.map((item) => (
              <div key={item.title}>
                <h3 className="text-sm uppercase tracking-[0.28em] text-cyan-100/70">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Detection Model"
          subtitle="Scan results are fixed by zone and reported in brief operational language."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {ZONES.map((zone) => (
              <div
                key={zone.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <h3 className="font-medium text-white">{zone.name}</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Autonomy emphasis: {zone.autonomousPriority}
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                  {zone.detections.map((detection) => (
                    <li key={detection}>{detection}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
