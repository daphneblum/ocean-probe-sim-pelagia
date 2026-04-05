import { useEffect, useState } from "react";
import {
  advanceSensorPlayback,
  createInitialSnapshot,
  stepSimulation,
} from "@/simulation/engine";
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

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      setSnapshot((current) => advanceSensorPlayback(current, Date.now()));
      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(frameId);
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
