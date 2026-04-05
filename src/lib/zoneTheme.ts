import { ZoneId } from "@/types/simulation";

export function getZoneThemeClass(zone: ZoneId) {
  switch (zone) {
    case "reef":
      return "zone-reef";
    case "open-water":
      return "zone-open-water";
    case "deep-sea":
      return "zone-deep-sea";
    case "debris-field":
      return "zone-debris-field";
  }
}
