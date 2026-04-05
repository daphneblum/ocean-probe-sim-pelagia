import { ZoneDefinition } from "@/types/simulation";

export const ZONES: ZoneDefinition[] = [
  {
    id: "reef",
    name: "Reef",
    depthRange: [0, 120],
    currentDrift: 0.8,
    signalModifier: 8,
    batteryDrain: 0.08,
    hullRisk: 0.25,
    description:
      "A shallow reef margin with dense biological activity, irregular relief, and variable near-surface current.",
    autonomousPriority: "survey",
    detections: [
      "Bioluminescent bloom charted along a coral ridge.",
      "Reef wall contour resolved with high-confidence sonar returns.",
      "Dense fish movement created a transient acoustic veil.",
    ],
  },
  {
    id: "open-water",
    name: "Open Water",
    depthRange: [121, 600],
    currentDrift: 1.2,
    signalModifier: 2,
    batteryDrain: 0.11,
    hullRisk: 0.12,
    description:
      "A broad pelagic zone with moderate current, clear water, and sparse acoustic returns.",
    autonomousPriority: "survey",
    detections: [
      "Thermocline edge mapped across a wide forward arc.",
      "Plankton scatter produced a diffuse mid-water signature.",
      "Migratory school passed beneath the probe's scan cone.",
    ],
  },
  {
    id: "deep-sea",
    name: "Deep Sea",
    depthRange: [601, 1800],
    currentDrift: 0.6,
    signalModifier: -12,
    batteryDrain: 0.16,
    hullRisk: 0.4,
    description:
      "Cold high-pressure water with weak returns, limited visibility, and slow but persistent drift.",
    autonomousPriority: "stabilize",
    detections: [
      "Hydrothermal mineral plume detected at long range.",
      "Abyssal plain topography returned a low-contrast profile.",
      "Unknown low-frequency acoustic pulse logged for review.",
    ],
  },
  {
    id: "debris-field",
    name: "Debris Field",
    depthRange: [250, 900],
    currentDrift: 1.5,
    signalModifier: -6,
    batteryDrain: 0.15,
    hullRisk: 0.75,
    description:
      "A cluttered passage of wreckage, suspended sediment, and frequent acoustic interference.",
    autonomousPriority: "caution",
    detections: [
      "Fragmented hull plating reflected irregular sonar echoes.",
      "Cable lattice identified; route caution markers inserted.",
      "Suspended debris cluster tracked drifting across the path.",
    ],
  },
];
