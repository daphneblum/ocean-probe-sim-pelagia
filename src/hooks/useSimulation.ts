import { useEffect, useState } from "react";
import { createInitialSnapshot, stepSimulation } from "@/simulation/engine";
import { SimulationAction, SimulationSnapshot } from "@/types/simulation";

export function useSimulation() {
  const [snapshot, setSnapshot] = useState<SimulationSnapshot>(() =>
    createInitialSnapshot(),
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSnapshot((current) => stepSimulation(current, "TICK"));
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  function dispatch(action: SimulationAction) {
    setSnapshot((current) => stepSimulation(current, action));
  }

  function reset() {
    setSnapshot(createInitialSnapshot());
  }

  return {
    snapshot,
    dispatch,
    reset,
  };
}
