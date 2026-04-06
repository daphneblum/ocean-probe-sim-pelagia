import { ControlsPanel } from "@/components/console/ControlsPanel";
import { EnvironmentPanel } from "@/components/console/EnvironmentPanel";
import { MissionLogPanel } from "@/components/console/MissionLogPanel";
import { ProbeSystemsPanel } from "@/components/console/ProbeSystemsPanel";
import { SonarDisplay } from "@/components/console/SonarDisplay";
import { SectionHeading } from "@/components/ui";
import { useSimulation } from "@/hooks/useSimulation";
import { cn } from "@/lib/cn";
import { getZoneThemeClass } from "@/lib/zoneTheme";
import { SimulationAction } from "@/types/simulation";

export function SimulationPage() {
  const { snapshot, dispatch, reset } = useSimulation();
  const zoneThemeClass = getZoneThemeClass(snapshot.state.systems.currentZone);

  function handleAction(action: SimulationAction) {
    dispatch(action);
  }

  return (
    <div className={cn("ocean-contours-panel zone-atmosphere space-y-6", zoneThemeClass)}>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeading
          eyebrow="Simulation Console"
          title="Monitor the vehicle and intervene as conditions change."
          description="Commands are always available. In autonomous mode, the probe follows fixed rules to preserve power, maintain contact, and continue survey work where conditions allow."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[27rem]">
          <div className="telemetry-tile telemetry-tile-active zone-panel rounded-[1.15rem] border border-cyan-300/18 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Battery
            </p>
            <p className="mt-1.5 text-lg text-white">
              {snapshot.state.systems.battery.toFixed(0)}%
            </p>
          </div>
          <div className="telemetry-tile zone-panel rounded-[1.15rem] border border-white/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Depth
            </p>
            <p className="mt-1.5 text-lg text-white">
              {snapshot.state.systems.depth.toFixed(0)} m
            </p>
          </div>
          <div className="telemetry-tile telemetry-tile-active zone-panel rounded-[1.15rem] border border-cyan-300/14 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Link
            </p>
            <p className="mt-1.5 text-lg text-white">
              {snapshot.state.systems.signalStrength.toFixed(0)}%
            </p>
          </div>
          <div className="telemetry-tile zone-panel rounded-[1.15rem] border border-white/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Status
            </p>
            <p className="mt-1.5 text-lg text-white">
              {snapshot.state.systems.missionStatus}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:items-stretch xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.9fr)]">
        <div className="grid gap-5">
          <SonarDisplay
            state={snapshot.state}
            detections={snapshot.detections}
            sweepAngle={snapshot.sweepAngle}
            sensorTimeMs={snapshot.sensorTimeMs}
            zoneThemeClass={zoneThemeClass}
          />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
            <ProbeSystemsPanel state={snapshot.state} />
            <EnvironmentPanel
              state={snapshot.state}
              latestDetection={snapshot.latestDetection}
              zoneThemeClass={zoneThemeClass}
            />
          </div>
          <ControlsPanel
            autonomousMode={snapshot.state.autonomousMode}
            onAction={handleAction}
            onToggleAutonomy={() => dispatch("TOGGLE_AUTONOMY")}
            onReset={reset}
            disabledActions={snapshot.disabledActions}
            recommendedAction={snapshot.recommendedAction}
            recoveryState={snapshot.state.recoveryState}
          />
        </div>
        <div className="min-h-0 h-full xl:h-[calc(100vh-14rem)] xl:max-h-[calc(100vh-14rem)]">
          <MissionLogPanel logs={snapshot.logs} />
        </div>
      </div>
    </div>
  );
}
