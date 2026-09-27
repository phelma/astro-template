/**
 * Opening hours helpers: normalise `siteConfig.business.hours` to a weekly
 * table, apply `specialHours` to dates, summarise ("Mon–Fri 9am–5:30pm, Sat
 * 10am–2pm"), format times with Intl and compute "open now" status for a
 * given instant in the business's time zone.
 *
 * Pure and dependency-free (type imports only) so it runs at build time and
 * in the browser: the opening-hours blocks bundle it into a small script.
 *
 * Times are "HH:MM" local to the business. A range whose `closes` is at or
 * before `opens` runs past midnight (18:00–02:00 closes at 2am the next day);
 * `opens === closes` means open 24 hours from `opens`.
 */
import type { BusinessHours, Day, SpecialHours } from "@/site.config"

export type { Day }

/** Monday-first week, matching schema.org day codes. */
export const DAYS: readonly Day[] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

const SCHEMA_DAY_NAMES = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
} as const satisfies Record<Day, string>

export interface TimeRange {
  opens: string
  closes: string
}

export type WeekSchedule = Record<Day, TimeRange[]>

export type SpecialHoursEntry = SpecialHours[number]

/** Everything the helpers need; serialisable so it can go in a data attribute. */
export interface HoursData {
  hours: BusinessHours
  specialHours: SpecialHours
  /** IANA time zone, e.g. "Europe/London". */
  timeZone: string
  /** BCP 47 locale for formatting, e.g. "en-GB". */
  locale: string
}

/** Copy used in summaries and status text. Override per site/language. */
export interface HoursLabels {
  closed: string
  open24h: string
  openNow: string
  closingSoon: string
  closedNow: string
  closedToday: string
  /** "{time}" is replaced. */
  closesAt: string
  /** "{time}" is replaced. */
  opensAt: string
  /** "{time}" is replaced. */
  opensTomorrow: string
  /** "{day}" and "{time}" are replaced. */
  opensOn: string
  today: string
}

export const defaultHoursLabels: HoursLabels = {
  closed: "Closed",
  open24h: "Open 24 hours",
  openNow: "Open now",
  closingSoon: "Closing soon",
  closedNow: "Closed now",
  closedToday: "Closed today",
  closesAt: "closes {time}",
  opensAt: "opens {time}",
  opensTomorrow: "opens tomorrow {time}",
  opensOn: "opens {day} {time}",
  today: "Today",
}

// ---------------------------------------------------------------------------
// Parsing and normalising

/** "17:30" -> 1050. */
export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

/** Range as [start, end) minutes from the start of its day; end may exceed 1440. */
export function rangeMinutes(range: TimeRange): [number, number] {
  const start = toMinutes(range.opens)
  let end = toMinutes(range.closes)
  if (end <= start) end += 1440
  return [start, end]
}

export function isOvernight(range: TimeRange): boolean {
  return toMinutes(range.closes) <= toMinutes(range.opens)
}

export function is24Hours(range: TimeRange): boolean {
  return range.opens === range.closes
}

const byStart = (a: TimeRange, b: TimeRange) =>
  toMinutes(a.opens) - toMinutes(b.opens)

/** Per-day table (Mo..Su), ranges sorted by opening time; closed days are []. */
export function normaliseWeek(hours: BusinessHours): WeekSchedule {
  const week = Object.fromEntries(
    DAYS.map((day) => [day, [] as TimeRange[]])
  ) as WeekSchedule
  for (const { days, opens, closes } of hours) {
    for (const day of new Set(days)) week[day].push({ opens, closes })
  }
  for (const day of DAYS) week[day].sort(byStart)
  return week
}

// ---------------------------------------------------------------------------
// Dates (ISO "YYYY-MM-DD", calendar arithmetic in UTC to avoid DST shifts)

function isoToUtc(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function addDays(iso: string, days: number): string {
  const date = isoToUtc(iso)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** Day code of an ISO date. */
export function dayOfDate(iso: string): Day {
  return DAYS[(isoToUtc(iso).getUTCDay() + 6) % 7]
}

/** Calendar date, day and minutes-since-midnight of `now` in `timeZone`. */
export function zonedNow(
  now: Date,
  timeZone: string
): { date: string; day: Day; minutes: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value])
  )
  const date = `${parts.year}-${parts.month}-${parts.day}`
  return {
    date,
    day: dayOfDate(date),
    minutes: (Number(parts.hour) % 24) * 60 + Number(parts.minute),
  }
}

/** ISO date "today" in `timeZone` (e.g. to filter past special hours at build). */
export function todayIn(timeZone: string, now: Date = new Date()): string {
  return zonedNow(now, timeZone).date
}

// ---------------------------------------------------------------------------
// Special hours

/** The special-hours entry covering `iso`, if any (later entries win). */
export function specialHoursFor(
  iso: string,
  specialHours: SpecialHours
): SpecialHoursEntry | undefined {
  let match: SpecialHoursEntry | undefined
  for (const entry of specialHours) {
    if (entry.from <= iso && iso <= (entry.until ?? entry.from)) match = entry
  }
  return match
}

/** Special-hours entry as ranges: [] when closed. */
export function specialRanges(entry: SpecialHoursEntry): TimeRange[] {
  return entry.opens && entry.closes
    ? [{ opens: entry.opens, closes: entry.closes }]
    : []
}

/**
 * Entries that haven't ended by `fromIso`, soonest first. `withinDays` limits
 * how far ahead to look (e.g. 60 to only mention the next two months).
 */
export function upcomingSpecialHours(
  specialHours: SpecialHours,
  fromIso: string,
  withinDays?: number
): SpecialHoursEntry[] {
  const horizon =
    withinDays === undefined ? undefined : addDays(fromIso, withinDays)
  return specialHours
    .filter((entry) => (entry.until ?? entry.from) >= fromIso)
    .filter((entry) => horizon === undefined || entry.from <= horizon)
    .sort((a, b) => a.from.localeCompare(b.from))
}

export interface DatedHours {
  date: string
  day: Day
  ranges: TimeRange[]
  /** Set when special hours replace the regular hours for this date. */
  special?: SpecialHoursEntry
}

/** Hours for a calendar date: special hours if any, else the weekly hours. */
export function hoursForDate(
  iso: string,
  week: WeekSchedule,
  specialHours: SpecialHours
): DatedHours {
  const day = dayOfDate(iso)
  const special = specialHoursFor(iso, specialHours)
  return special
    ? { date: iso, day, ranges: specialRanges(special), special }
    : { date: iso, day, ranges: week[day] }
}

/** The next `count` days from `fromIso` with special hours merged in. */
export function upcomingDays(
  fromIso: string,
  data: Pick<HoursData, "hours" | "specialHours">,
  count = 7
): DatedHours[] {
  const week = normaliseWeek(data.hours)
  return Array.from({ length: count }, (_, i) =>
    hoursForDate(addDays(fromIso, i), week, data.specialHours)
  )
}

// ---------------------------------------------------------------------------
// Formatting

const formatters = new Map<string, Intl.DateTimeFormat>()
function formatter(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = `${locale}|${JSON.stringify(options)}`
  let cached = formatters.get(key)
  if (!cached) {
    cached = new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...options })
    formatters.set(key, cached)
  }
  return cached
}

/**
 * Locale-aware clock time. English locales use the 12-hour clock in compact
 * form ("9am", "5:30pm"), as UK businesses usually write it; other locales
 * use their own convention ("09:00"). Force a clock with a Unicode extension:
 * "en-GB-u-hc-h23" gives "17:30", "de-DE-u-hc-h12" gives "5:30 PM".
 */
export function formatTime(time: string, locale: string): string {
  const minutes = toMinutes(time) % 1440
  const date = new Date(
    Date.UTC(2000, 0, 1, Math.floor(minutes / 60), minutes % 60)
  )
  const english = locale.toLowerCase().startsWith("en")
  const parts = formatter(locale, {
    hour: "numeric",
    minute: "2-digit",
    ...(english && !/-u-.*hc-/.test(locale) && { hour12: true }),
  }).formatToParts(date)
  if (!parts.some((part) => part.type === "dayPeriod")) {
    return parts.map((part) => part.value).join("")
  }
  const out: string[] = []
  parts.forEach((part, i) => {
    const next = parts[i + 1]
    // Drop ":00" (the minute and the separator before it).
    if (
      minutes % 60 === 0 &&
      (part.type === "minute" || next?.type === "minute")
    ) {
      return
    }
    // English: "5:30pm", no space before the day period.
    if (english && part.type === "literal" && next?.type === "dayPeriod") return
    out.push(
      english && part.type === "dayPeriod"
        ? part.value.toLowerCase()
        : part.value
    )
  })
  return out.join("").trim()
}

/** "9am–5:30pm"; 24-hour ranges use `labels.open24h`. */
export function formatRange(
  range: TimeRange,
  locale: string,
  labels: Pick<HoursLabels, "open24h"> = defaultHoursLabels
): string {
  if (is24Hours(range)) return labels.open24h
  return `${formatTime(range.opens, locale)}–${formatTime(range.closes, locale)}`
}

/** All ranges of a day ("9am–1pm and 2pm–5pm"), or `labels.closed`. */
export function formatRanges(
  ranges: TimeRange[],
  locale: string,
  labels: Pick<HoursLabels, "open24h" | "closed"> = defaultHoursLabels
): string {
  if (ranges.length === 0) return labels.closed
  return listFormat(
    locale,
    ranges.map((range) => formatRange(range, locale, labels))
  )
}

/** Day name: "Mon" (short) or "Monday" (long). */
export function formatDay(
  day: Day,
  locale: string,
  width: "short" | "long" = "short"
): string {
  // 1 Jan 2024 was a Monday.
  const date = new Date(Date.UTC(2024, 0, 1 + DAYS.indexOf(day)))
  return formatter(locale, { weekday: width }).format(date)
}

/** "Thu 25 Dec" for an ISO date. */
export function formatDate(
  iso: string,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  }
): string {
  return formatter(locale, options).format(isoToUtc(iso))
}

/** "Thu 25 Dec" or "Thu 25 – Fri 26 Dec" for a special-hours entry. */
export function formatDateSpan(
  entry: SpecialHoursEntry,
  locale: string
): string {
  const until = entry.until ?? entry.from
  if (until === entry.from) return formatDate(entry.from, locale)
  return formatter(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatRange(isoToUtc(entry.from), isoToUtc(until))
}

function listFormat(locale: string, items: string[]): string {
  return new Intl.ListFormat(locale, {
    style: "short",
    type: "conjunction",
  }).format(items)
}

// ---------------------------------------------------------------------------
// Summaries

export interface HoursGroup {
  days: Day[]
  ranges: TimeRange[]
}

const rangesKey = (ranges: TimeRange[]) =>
  ranges.map((r) => `${r.opens}-${r.closes}`).join(",")

/**
 * Days that share identical hours, in week order of first appearance.
 * Closed days are grouped too (ranges []).
 */
export function groupWeek(week: WeekSchedule): HoursGroup[] {
  const groups = new Map<string, HoursGroup>()
  for (const day of DAYS) {
    const key = rangesKey(week[day])
    const group = groups.get(key)
    if (group) group.days.push(day)
    else groups.set(key, { days: [day], ranges: week[day] })
  }
  return [...groups.values()]
}

/** "Mon–Fri", "Mon, Wed and Fri", "Mon–Wed and Sat" (runs of 3+ use a dash). */
export function formatDays(
  days: Day[],
  locale: string,
  width: "short" | "long" = "short"
): string {
  const indexes = days.map((day) => DAYS.indexOf(day)).sort((a, b) => a - b)
  const runs: number[][] = []
  for (const index of indexes) {
    const run = runs.at(-1)
    if (run && index === run.at(-1)! + 1) run.push(index)
    else runs.push([index])
  }
  const labels = runs.flatMap((run) => {
    const names = run.map((i) => formatDay(DAYS[i], locale, width))
    return run.length >= 3 ? [`${names[0]}–${names.at(-1)}`] : names
  })
  return listFormat(locale, labels)
}

/**
 * One-line summary: "Mon–Fri 9am–5:30pm, Sat 10am–2pm". Closed days are
 * left out unless `includeClosed` ("…, Sun closed").
 */
export function summariseHours(
  hours: BusinessHours,
  locale: string,
  {
    includeClosed = false,
    labels = defaultHoursLabels,
    separator = ", ",
    dayWidth = "short",
  }: {
    includeClosed?: boolean
    labels?: Pick<HoursLabels, "open24h" | "closed">
    separator?: string
    dayWidth?: "short" | "long"
  } = {}
): string {
  return groupWeek(normaliseWeek(hours))
    .filter((group) => includeClosed || group.ranges.length > 0)
    .map((group) => {
      const days = formatDays(group.days, locale, dayWidth)
      const times = formatRanges(group.ranges, locale, labels)
      // "Sun closed", "Sun open 24 hours" read better mid-sentence.
      const whole =
        group.ranges.length === 0 ||
        (group.ranges.length === 1 && is24Hours(group.ranges[0]))
      return `${days} ${whole ? times.toLocaleLowerCase(locale) : times}`
    })
    .join(separator)
}

// ---------------------------------------------------------------------------
// Status

export type HoursState =
  | "open"
  | "closing-soon"
  /** Closed now, opens again later today. */
  | "opens-later"
  /** Closed for the rest of today. */
  | "closed"

/** How far ahead `hoursStatus` looks for the next opening/closing. */
const LOOKAHEAD_DAYS = 14

export interface HoursStatus {
  state: HoursState
  /** Local date/time of the next change (closing when open, opening when closed). */
  next?: { date: string; time: string; dayOffset: number }
  /** Today's hours (special hours applied). */
  today: DatedHours
}

/**
 * Open/closed status at `now` in `data.timeZone`. Accounts for special hours
 * and ranges that run past midnight. "closing-soon" when closing within
 * `soonMinutes`. Looks up to 14 days ahead for the next change.
 */
export function hoursStatus(
  now: Date,
  data: Pick<HoursData, "hours" | "specialHours" | "timeZone">,
  { soonMinutes = 30 }: { soonMinutes?: number } = {}
): HoursStatus {
  const week = normaliseWeek(data.hours)
  const { date, minutes } = zonedNow(now, data.timeZone)
  const today = hoursForDate(date, week, data.specialHours)

  // Open intervals in minutes relative to the start of today, from yesterday
  // (ranges past midnight) to a week ahead, merged where they touch so
  // back-to-back ranges (18:00–00:00, 00:00–02:00) close at the real time.
  const intervals: [number, number][] = []
  for (let offset = -1; offset <= LOOKAHEAD_DAYS; offset++) {
    const day =
      offset === 0
        ? today
        : hoursForDate(addDays(date, offset), week, data.specialHours)
    for (const [start, end] of day.ranges.map(rangeMinutes)) {
      intervals.push([start + offset * 1440, end + offset * 1440])
    }
  }
  intervals.sort((a, b) => a[0] - b[0])
  const merged: [number, number][] = []
  for (const [start, end] of intervals) {
    const last = merged.at(-1)
    if (last && start <= last[1]) last[1] = Math.max(last[1], end)
    else merged.push([start, end])
  }

  const current = merged.find(([s, e]) => s <= minutes && minutes < e)
  if (current) {
    const end = current[1]
    // Open through the whole lookahead (e.g. 24/7): no closing time to show.
    if (end >= (LOOKAHEAD_DAYS + 1) * 1440) return { state: "open", today }
    const dayOffset = Math.floor(end / 1440)
    return {
      state: end - minutes <= soonMinutes ? "closing-soon" : "open",
      next: {
        date: addDays(date, dayOffset),
        time: minutesToTime(end % 1440),
        dayOffset,
      },
      today,
    }
  }

  const opening = merged.find(([s]) => s > minutes)
  if (opening) {
    const dayOffset = Math.floor(opening[0] / 1440)
    return {
      state: dayOffset === 0 ? "opens-later" : "closed",
      next: {
        date: addDays(date, dayOffset),
        time: minutesToTime(opening[0] % 1440),
        dayOffset,
      },
      today,
    }
  }
  return { state: "closed", today }
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

/** Human text for a status: { label: "Open now", detail: "closes 5:30pm" }. */
export function describeStatus(
  status: HoursStatus,
  locale: string,
  labels: HoursLabels = defaultHoursLabels
): { label: string; detail?: string } {
  const time = status.next ? formatTime(status.next.time, locale) : ""
  const fill = (template: string, day = "") =>
    template.replace("{time}", time).replace("{day}", day)

  switch (status.state) {
    case "open":
    case "closing-soon":
      return {
        label: status.state === "open" ? labels.openNow : labels.closingSoon,
        detail: status.next ? fill(labels.closesAt) : undefined,
      }
    case "opens-later":
      return { label: labels.closedNow, detail: fill(labels.opensAt) }
    case "closed": {
      const label =
        status.today.ranges.length === 0 ? labels.closedToday : labels.closedNow
      if (!status.next) return { label }
      if (status.next.dayOffset === 1) {
        return { label, detail: fill(labels.opensTomorrow) }
      }
      return {
        label,
        detail: fill(
          labels.opensOn,
          formatDay(dayOfDate(status.next.date), locale)
        ),
      }
    }
  }
}

// ---------------------------------------------------------------------------
// schema.org

/** "Mo" -> "Monday" (schema.org DayOfWeek). */
export function schemaDayName(day: Day): (typeof SCHEMA_DAY_NAMES)[Day] {
  return SCHEMA_DAY_NAMES[day]
}

/**
 * Times as schema.org/Google expect: 24 hours is "00:00"–"23:59"; ranges
 * past midnight stay on the opening day with the early closing time.
 */
export function schemaTimes(range: TimeRange): TimeRange {
  return is24Hours(range) ? { opens: "00:00", closes: "23:59" } : range
}
