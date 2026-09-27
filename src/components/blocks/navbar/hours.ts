import type { BusinessHours, Day, SpecialHours } from "@/site.config"

/** Days in display order (Monday first). */
const WEEK: readonly Day[] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

/** Hours per day as "09:00–17:30" (split shifts joined with ", "), or null when closed. */
export function hoursByDay(hours: BusinessHours): Record<Day, string | null> {
  const byDay = Object.fromEntries(WEEK.map((d) => [d, null])) as Record<
    Day,
    string | null
  >
  for (const { days, opens, closes } of hours) {
    for (const d of days) {
      const range = `${opens}–${closes}`
      byDay[d] = byDay[d] ? `${byDay[d]}, ${range}` : range
    }
  }
  return byDay
}

/** Short weekday name for a day code in `locale` (2024-01-01 was a Monday). */
function dayName(day: Day, locale: string): string {
  const date = new Date(Date.UTC(2024, 0, 1 + WEEK.indexOf(day)))
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC",
  }).format(date)
}

/**
 * Compact weekly summary grouping consecutive days with the same hours:
 * "Mon–Fri 09:00–17:30 · Sat 10:00–14:00". Closed days are left out.
 */
export function summariseHours(hours: BusinessHours, locale = "en-GB"): string {
  const byDay = hoursByDay(hours)
  const groups: { from: Day; to: Day; range: string }[] = []
  for (const day of WEEK) {
    const range = byDay[day]
    const last = groups.at(-1)
    if (!range) continue
    if (
      last &&
      last.range === range &&
      WEEK.indexOf(last.to) === WEEK.indexOf(day) - 1
    ) {
      last.to = day
    } else {
      groups.push({ from: day, to: day, range })
    }
  }
  return groups
    .map(({ from, to, range }) => {
      const days =
        from === to
          ? dayName(from, locale)
          : `${dayName(from, locale)}–${dayName(to, locale)}`
      return `${days} ${range}`
    })
    .join(" · ")
}

/**
 * Serialisable schedule for the client-side "today" enhancement: hours
 * indexed by JS `getDay()` (0 = Sunday) plus special dates.
 */
export function hoursSchedule(hours: BusinessHours, special: SpecialHours) {
  const byDay = hoursByDay(hours)
  return {
    week: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
      (d) => byDay[d as Day]
    ),
    special: special.map((s) => ({
      from: s.from,
      until: s.until ?? s.from,
      range: s.opens && s.closes ? `${s.opens}–${s.closes}` : null,
    })),
  }
}

export type HoursSchedule = ReturnType<typeof hoursSchedule>
