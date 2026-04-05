import { cn } from "@/lib/cn";
import { Panel } from "@/components/ui";
import { ProbeState, RadarDetection } from "@/types/simulation";

const DETECTION_HOLD_MS = 650;
const DETECTION_FADE_MS = 1100;

export function SonarDisplay({
  state,
  detections,
  sweepAngle,
  sensorTimeMs,
  zoneThemeClass,
}: {
  state: ProbeState;
  detections: RadarDetection[];
  sweepAngle: number;
  sensorTimeMs: number;
  zoneThemeClass: string;
}) {
  return (
    <Panel
      title="Acoustic Plot"
      className={cn("panel-focus zone-panel relative", zoneThemeClass)}
      headerRight={
        <div className="telemetry-tile-active zone-panel rounded-full border border-cyan-300/18 px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-cyan-100/80">
          Link {state.systems.signalStrength.toFixed(0)}%
        </div>
      }
    >
      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-center">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-slate-950/35 px-4 py-4 shadow-[inset_0_1px_0_rgba(196,239,248,0.04)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--zone-accent,_rgba(66,206,224,0.2)),_rgba(2,10,20,0.96)_55%)]" />
          <div className="zone-grid absolute inset-0 bg-[size:48px_48px] opacity-35" />
          <div className="relative mx-auto aspect-square w-full max-w-[30rem] rounded-full border border-cyan-300/20 bg-[radial-gradient(circle_at_center,_var(--zone-accent-soft,_rgba(127,233,245,0.08)),_transparent_58%)] shadow-[inset_0_0_46px_var(--zone-accent-soft,_rgba(84,191,214,0.085)),0_0_34px_var(--zone-accent-soft,_rgba(59,129,145,0.08))]">
            {[0.2, 0.38, 0.56, 0.74, 0.92].map((ring, index) => (
              <div
                key={ring}
                className="absolute left-1/2 top-1/2 rounded-full border border-cyan-200/12"
                style={{
                  width: `${ring * 100}%`,
                  height: `${ring * 100}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: 1 - index * 0.12,
                }}
              />
            ))}
            <div className="absolute inset-[8%] rounded-full border border-cyan-200/7" />
            <div className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-200/8 to-transparent" />
            <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-200/8 to-transparent" />
            <div className="sonar-pulse-ring absolute left-1/2 top-1/2 z-10 h-[12%] w-[12%] rounded-full border border-cyan-100/35 shadow-[0_0_12px_rgba(143,242,255,0.08)]" />
            <div className="sonar-breathe absolute left-1/2 top-1/2 z-10 h-[48%] w-[48%] rounded-full border border-cyan-200/14 bg-cyan-300/[0.035]" />
            <div
              className="absolute left-1/2 top-1/2 z-20 h-1/2 w-[1px] origin-bottom bg-gradient-to-t from-cyan-100/0 via-cyan-100/60 to-transparent shadow-[0_0_20px_rgba(82,236,255,0.18)]"
              style={{
                transform: `translate(-50%, -100%) rotate(${sweepAngle}deg)`,
              }}
            />
            <div className="absolute left-1/2 top-1/2 z-30 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(142,245,255,0.42)]" />
            {detections.map((detection) => {
              const revealedAt = detection.revealedAtMs;

              if (revealedAt === undefined) {
                return null;
              }

              const visibleFor = sensorTimeMs - revealedAt;

              if (visibleFor > DETECTION_HOLD_MS + DETECTION_FADE_MS) {
                return null;
              }

              const opacity =
                visibleFor <= DETECTION_HOLD_MS
                  ? 1
                  : Math.max(
                      0,
                      1 - (visibleFor - DETECTION_HOLD_MS) / DETECTION_FADE_MS,
                    );
              const detectionClass =
                detection.kind === "biological"
                  ? "bg-emerald-200/90 shadow-[0_0_10px_rgba(110,255,220,0.32)]"
                  : detection.kind === "terrain"
                    ? "bg-cyan-100/90 shadow-[0_0_10px_rgba(180,244,255,0.28)]"
                    : detection.kind === "debris"
                      ? "bg-amber-100/85 shadow-[0_0_10px_rgba(255,230,160,0.24)]"
                      : "bg-slate-200/85 shadow-[0_0_10px_rgba(226,232,240,0.22)]";

              return (
                <div
                  key={detection.id}
                  className="absolute left-0 top-0 z-30 h-full w-full"
                  style={{ opacity }}
                >
                  <div
                    className="absolute h-[1px] bg-gradient-to-r from-transparent via-cyan-100/12 to-transparent"
                    style={{
                      left: `${Math.min(detection.x, 50)}%`,
                      top: `${detection.y}%`,
                      width: `${Math.abs(detection.x - 50)}%`,
                    }}
                  />
                  <div
                    className={cn("sonar-contact absolute h-2 w-2 rounded-full", detectionClass)}
                    style={{
                      left: `${detection.x}%`,
                      top: `${detection.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    title={detection.label}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid gap-3 text-sm text-slate-300">
          <div className="telemetry-tile zone-panel rounded-[1.15rem] border border-white/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Position
            </p>
            <p className="mt-1.5 text-base text-white">
              {state.position.toFixed(0)} m easting
            </p>
          </div>
          <div className="telemetry-tile zone-panel rounded-[1.15rem] border border-white/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Heading
            </p>
            <p className="mt-1.5 text-base text-white">
              {state.heading.toFixed(0)} deg
            </p>
          </div>
          <div className="telemetry-tile telemetry-tile-active zone-panel rounded-[1.15rem] border border-cyan-300/12 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Cycle
            </p>
            <p className="mt-1.5 text-base text-white">
              T+{state.tick.toString().padStart(2, "0")}
            </p>
          </div>
          <div className="telemetry-tile zone-panel rounded-[1.15rem] border border-white/10 px-4 py-3">
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
