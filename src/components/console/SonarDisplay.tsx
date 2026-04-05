import { Panel } from "@/components/ui";
import { ProbeState } from "@/types/simulation";

export function SonarDisplay({ state }: { state: ProbeState }) {
  const sweepRotation = (state.tick * 27) % 360;
  const pulseScale = 1 + (state.tick % 4) * 0.04;

  return (
    <Panel
      title="Acoustic Plot"
      subtitle="Relative returns, heading, and survey cycle."
      className="ocean-contours-panel relative overflow-hidden"
      headerRight={
        <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-cyan-100/80">
          Link {state.systems.signalStrength.toFixed(0)}%
        </div>
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(66,206,224,0.18),_rgba(2,10,20,0.96)_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(92,221,236,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(92,221,236,0.06)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-center">
        <div className="relative mx-auto aspect-square w-full max-w-[30rem] rounded-full border border-cyan-300/25">
          {[0.24, 0.44, 0.64, 0.84].map((ring) => (
            <div
              key={ring}
              className="absolute left-1/2 top-1/2 rounded-full border border-cyan-200/15"
              style={{
                width: `${ring * 100}%`,
                height: `${ring * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
          <div
            className="absolute left-1/2 top-1/2 h-[46%] w-[46%] rounded-full border border-cyan-200/25 bg-cyan-300/5"
            style={{
              transform: `translate(-50%, -50%) scale(${pulseScale})`,
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-1/2 w-[1px] origin-bottom bg-gradient-to-t from-cyan-100/10 via-cyan-200/70 to-transparent shadow-[0_0_22px_rgba(82,236,255,0.35)]"
            style={{
              transform: `translate(-50%, -100%) rotate(${sweepRotation}deg)`,
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(142,245,255,0.85)]" />
          <div
            className="absolute h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,255,220,0.9)]"
            style={{ left: "65%", top: "36%" }}
          />
          <div
            className="absolute h-2 w-2 rounded-full bg-cyan-100 shadow-[0_0_16px_rgba(180,244,255,0.85)]"
            style={{ left: "38%", top: "28%" }}
          />
          <div
            className="absolute h-2 w-2 rounded-full bg-amber-200 shadow-[0_0_16px_rgba(255,230,160,0.85)]"
            style={{ left: "72%", top: "63%" }}
          />
        </div>
        <div className="grid gap-3 text-sm text-slate-300">
          <div className="rounded-[1.15rem] border border-white/10 bg-slate-950/45 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Position
            </p>
            <p className="mt-1.5 text-base text-white">
              {state.position.toFixed(0)} m easting
            </p>
          </div>
          <div className="rounded-[1.15rem] border border-white/10 bg-slate-950/45 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Heading
            </p>
            <p className="mt-1.5 text-base text-white">
              {state.heading.toFixed(0)} deg
            </p>
          </div>
          <div className="rounded-[1.15rem] border border-white/10 bg-slate-950/45 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Cycle
            </p>
            <p className="mt-1.5 text-base text-white">
              T+{state.tick.toString().padStart(2, "0")}
            </p>
          </div>
          <div className="rounded-[1.15rem] border border-white/10 bg-slate-950/45 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Mode
            </p>
            <p className="mt-1.5 text-base text-white">
              {state.autonomousMode ? "Autonomous" : "Manual"}
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
