export const decisionRules = [
  "Below 45% hull integrity, the vehicle reduces movement and favors ascent.",
  "Below 28% battery reserve, autonomy begins a controlled return to shallower water.",
  "Below 35% signal strength, the vehicle climbs until link quality improves.",
  "Within a debris field, forward movement is reduced and scans take priority.",
  "Under nominal conditions, the vehicle alternates between track advancement and sonar sweeps.",
];

export const systemsDescriptions = [
  {
    title: "Battery Management",
    body: "Power draw changes by maneuver and operating zone, producing a steady and traceable consumption pattern.",
  },
  {
    title: "Adaptive Sensors",
    body: "Sensor status shifts with depth and link quality, reflecting reduced confidence in more difficult conditions.",
  },
  {
    title: "Hull Monitoring",
    body: "Structural wear accumulates gradually in high-pressure water and in cluttered zones with elevated contact risk.",
  },
  {
    title: "Detection Registry",
    body: "Each scan pulls from a fixed set of zone-specific contacts, keeping results consistent and place-dependent.",
  },
];
