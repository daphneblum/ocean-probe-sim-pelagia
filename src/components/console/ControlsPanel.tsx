import { Panel } from "@/components/ui";
import { SimulationAction } from "@/types/simulation";

const actions: Array<{
  action: SimulationAction;
  label: string;
  energy: "Low" | "Moderate" | "High";
}> = [
  { action: "MOVE_FORWARD", label: "Move Forward", energy: "Moderate" },
  { action: "ASCEND", label: "Ascend", energy: "Low" },
  { action: "DESCEND", label: "Descend", energy: "Moderate" },
  { action: "SCAN", label: "Scan", energy: "High" },
  { action: "HOLD_POSITION", label: "Hold Position", energy: "Low" },
  { action: "RETURN_TO_SURFACE", label: "Return to Surface", energy: "Moderate" },
];

export function ControlsPanel({
  onAction,
  autonomousMode,
  onToggleAutonomy,
  onReset,
  disabledActions,
  recommendedAction,
  recoveryState,
}: {
  onAction: (action: SimulationAction) => void;
  autonomousMode: boolean;
  onToggleAutonomy: () => void;
  onReset: () => void;
  disabledActions: SimulationAction[];
  recommendedAction?: SimulationAction;
  recoveryState: "Nominal" | "Low Power Return" | "Recharging";
}) {
  return (
    <Panel
      title="Command Input"
      subtitle="Manual control remains available while autonomy is active."
    >
      {recoveryState !== "Nominal" ? (
        <div className="mb-4 rounded-[1.15rem] border border-amber-200/14 bg-amber-200/[0.05] px-4 py-3 text-sm leading-6 text-slate-200">
          {recoveryState === "Low Power Return"
            ? "Low-power recovery state active. Return to surface is recommended until a safe recharge depth is reached."
            : "Surface recharge in progress. Forward movement, descent, and active scan loads are temporarily unavailable."}
        </div>
      ) : null}
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map(({ action, label, energy }) => (
          <button
            key={action}
            type="button"
            onClick={() => onAction(action)}
            disabled={disabledActions.includes(action)}
            className="rounded-[1.15rem] border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:border-white/6 disabled:bg-white/[0.025] disabled:text-slate-500"
          >
            <div className="flex items-center justify-between gap-2">
              <span>{label}</span>
              {recommendedAction === action ? (
                <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-100/70">
                  Recommended
                </span>
              ) : null}
            </div>
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-slate-500">
              {energy} draw
            </p>
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onToggleAutonomy}
          disabled={recoveryState === "Recharging"}
          className="rounded-[1.15rem] border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50 transition hover:border-cyan-200/40 disabled:cursor-not-allowed disabled:border-white/8 disabled:bg-white/[0.03] disabled:text-slate-500"
        >
          Autonomous Mode: {autonomousMode ? "Enabled" : "Disabled"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-[1.15rem] border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 transition hover:border-white/20 hover:text-white"
        >
          Reset Mission
        </button>
      </div>
    </Panel>
  );
}
