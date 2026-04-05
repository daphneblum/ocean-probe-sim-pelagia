import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui";

const highlights = [
  "Deterministic autonomy with clear operating rules",
  "Zone-specific sonar contacts and chronological logging",
  "Simulation logic kept separate from the interface layer",
];

export function LandingPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/40 p-8 backdrop-blur-xl sm:p-10">
        <SectionHeading
          eyebrow="Mission Briefing"
          title="Mission control for a small autonomous survey probe."
          description="This console follows Pelagia as it works across reef shelves, open water, deep pelagic layers, and obstructed debris corridors under a fixed set of operating rules."
        />
        <div className="mt-8 space-y-5 text-sm leading-7 text-slate-300">
          <p>
            The vehicle is tasked with maintaining a steady survey track while
            managing battery reserve, hull condition, uplink quality, and
            sonar observations.
          </p>
          <p>
            Manual control remains available throughout the mission. When
            autonomous mode is engaged, Pelagia adjusts its behavior according
            to signal quality, remaining power, local hazard, and system state.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/simulation"
            className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 text-sm text-cyan-50 transition hover:border-cyan-200/60 hover:bg-cyan-300/15"
          >
            Enter Simulation
          </Link>
          <Link
            to="/system-overview"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-200 transition hover:border-white/20 hover:text-white"
          >
            Review System Model
          </Link>
        </div>
      </section>

      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_top,_rgba(48,192,218,0.18),_transparent_46%),rgba(2,9,18,0.68)] p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
            Operational Notes
          </p>
          <h3 className="mt-3 font-serif text-2xl text-white">
            Built as a field console, not a game display.
          </h3>
          <div className="mt-5 space-y-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/45 p-8">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
            Probe Profile
          </p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
            <p>
              Pelagia is a compact survey platform intended for extended passes
              in mixed water conditions, with conservative propulsion and
              adaptive sensing.
            </p>
            <p>
              The interface emphasizes readable telemetry and concise event
              reporting in the style of a research operations station.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
