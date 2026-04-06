import { Panel } from "@/components/ui";
import { MissionLogEntry } from "@/types/simulation";
import { cn } from "@/lib/cn";

const categoryLabel: Record<MissionLogEntry["category"], string> = {
  system: "System",
  navigation: "Navigation",
  scan: "Scan",
  autonomy: "Autonomy",
  environment: "Environment",
};

export function MissionLogPanel({ logs }: { logs: MissionLogEntry[] }) {
  return (
    <Panel
      title="Mission Log"
      subtitle="Time-ordered vehicle and environment entries."
      className="flex h-full min-h-0 flex-col"
      headerRight={
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-slate-300">
          Live feed · {logs.length}
        </div>
      }
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-slate-950/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-slate-950/90 to-transparent" />
        <div className="min-h-0 h-full space-y-2 overflow-y-auto pr-1">
        {logs
          .slice()
          .reverse()
          .map((entry) => {
            const warning = isWarningEntry(entry);

            return (
              <div
                key={entry.id}
                className={cn(
                  "grid grid-cols-[3.9rem_minmax(0,1fr)] gap-4 rounded-[1.05rem] border px-3.5 py-3",
                  warning
                    ? "border-amber-200/14 bg-amber-200/[0.045]"
                    : entry.category === "scan"
                      ? "border-cyan-200/10 bg-cyan-200/[0.035]"
                      : entry.category === "autonomy"
                        ? "border-slate-200/10 bg-slate-200/[0.035]"
                        : "border-white/8 bg-white/[0.03]",
                )}
              >
                <div className="border-r border-white/8 pr-4 pt-0.5 text-right">
                  <p className="whitespace-nowrap font-mono text-[11px] tracking-[0.12em] text-slate-500">
                    T+{entry.tick.toString().padStart(2, "0")}
                  </p>
                </div>
                <div className="min-w-0 pt-0.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "inline-block h-1.5 w-1.5 rounded-full",
                        warning
                          ? "bg-amber-100/60"
                          : entry.category === "scan"
                            ? "bg-cyan-100/55"
                            : entry.category === "autonomy"
                              ? "bg-slate-300/55"
                              : entry.category === "navigation"
                                ? "bg-slate-200/45"
                                : "bg-slate-400/45",
                      )}
                    />
                    <p
                      className={cn(
                        "text-[11px] uppercase tracking-[0.2em]",
                        warning ? "text-amber-50/75" : "text-slate-500",
                      )}
                    >
                      {categoryLabel[entry.category]}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-slate-200">
                    {entry.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function isWarningEntry(entry: MissionLogEntry) {
  if (entry.category !== "system") {
    return false;
  }

  return /low|reduced|attenuation|limited|advised/i.test(entry.message);
}
