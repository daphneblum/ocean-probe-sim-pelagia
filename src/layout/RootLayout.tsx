import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/cn";

const navItems = [
  { to: "/", label: "Mission Briefing", end: true },
  { to: "/simulation", label: "Simulation Console" },
  { to: "/system-overview", label: "System Overview" },
];

export function RootLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(60,140,170,0.14),_transparent_26%),linear-gradient(180deg,_#020b14_0%,_#051624_42%,_#02060b_100%)] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(120,198,220,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(120,198,220,0.03)_1px,transparent_1px)] bg-[size:120px_120px] opacity-20" />
      <div className="ocean-contours pointer-events-none absolute inset-0 opacity-55" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(62,171,191,0.1),transparent_18%),radial-gradient(circle_at_80%_0%,rgba(95,135,210,0.06),transparent_22%),radial-gradient(circle_at_60%_100%,rgba(13,66,96,0.28),transparent_35%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-10 pt-6 sm:px-8 lg:px-10">
        <header className="panel-surface soft-edge-light mb-8 flex flex-col gap-6 rounded-[2rem] border border-white/10 px-5 py-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              Autonomous Ocean Probe Simulation
            </p>
            <h1 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
              Pelagia Operations Console
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                end={item.end}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full border px-4 py-2 text-sm transition",
                    isActive
                      ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-50 shadow-[0_0_18px_rgba(91,214,240,0.1)]"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-200/30 hover:text-white",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
