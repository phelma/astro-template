/**
 * Minimal opening-hours formatting for FooterHours' fallback list only.
 * Richer hours (open now, special hours, grouping) belong in the dedicated
 * hours helpers/blocks; pass one into FooterHours' slot to replace this.
 */
import type { BusinessHours, Day } from "@/site.config"

const ORDER: Day[] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
const SHORT: Record<Day, string> = {
  Mo: "Mon",
  Tu: "Tue",
  We: "Wed",
  Th: "Thu",
  Fr: "Fri",
  Sa: "Sat",
  Su: "Sun",
}

/** "Mon–Fri" for a run of 3+ consecutive days, else "Sat, Sun". */
function dayRange(days: Day[]): string {
  const sorted = [...days].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))
  const first = ORDER.indexOf(sorted[0])
  const consecutive = sorted.every((d, i) => ORDER.indexOf(d) === first + i)
  return consecutive && sorted.length > 2
    ? `${SHORT[sorted[0]]}–${SHORT[sorted[sorted.length - 1]]}`
    : sorted.map((d) => SHORT[d]).join(", ")
}

export function simpleHoursRows(
  hours: BusinessHours
): { days: string; time: string }[] {
  return hours.map((h) => ({
    days: dayRange(h.days),
    time: `${h.opens}–${h.closes}`,
  }))
}
