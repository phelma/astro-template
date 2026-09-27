/**
 * Progressive enhancement for the opening-hours blocks. The build can't know
 * "now", so components render neutral HTML plus their data as JSON in a
 * `data-hours` attribute; this script (bundled, CSP-hashed, loaded once per
 * page however many instances there are) fills in the live parts and
 * refreshes every minute:
 *
 * - `[data-slot=opening-hours-status]`: state, label and detail text.
 * - `[data-slot=opening-hours-list]`: marks today's row (`data-today`,
 *   `aria-current="date"`) and shows special hours falling in the next 7 days.
 * - `[data-slot=opening-hours-special-item]`: hides entries that have ended.
 *
 * Text is set with textContent only (Trusted Types).
 */
import {
  describeStatus,
  formatRanges,
  hoursStatus,
  upcomingDays,
  zonedNow,
  type HoursData,
  type HoursLabels,
} from "@/lib/hours"

interface Payload extends HoursData {
  labels: HoursLabels
  soonMinutes?: number
}

function readPayload(el: HTMLElement): Payload | undefined {
  try {
    return JSON.parse(el.dataset.hours ?? "") as Payload
  } catch {
    return undefined
  }
}

function slot(root: Element, name: string): HTMLElement | null {
  return root.querySelector<HTMLElement>(`[data-slot="${name}"]`)
}

function updateStatus(el: HTMLElement, now: Date) {
  const data = readPayload(el)
  if (!data) return
  const status = hoursStatus(now, data, { soonMinutes: data.soonMinutes })
  const { label, detail } = describeStatus(status, data.locale, data.labels)
  el.dataset.state = status.state
  const labelEl = slot(el, "opening-hours-status-label")
  const detailEl = slot(el, "opening-hours-status-detail")
  if (labelEl) {
    labelEl.textContent = label
    labelEl.hidden = false
  }
  if (detailEl) {
    detailEl.textContent = detail ?? ""
    detailEl.hidden = !detail
  }
  const separator = slot(el, "opening-hours-status-separator")
  if (separator) separator.hidden = !detail
}

function updateList(el: HTMLElement, now: Date) {
  const data = readPayload(el)
  if (!data) return
  const { date, day: today } = zonedNow(now, data.timeZone)
  const week = upcomingDays(date, data, 7)

  for (const row of el.querySelectorAll<HTMLElement>("[data-days]")) {
    const days = row.dataset.days?.split(" ") ?? []
    const isToday = days.includes(today)
    row.toggleAttribute("data-today", isToday)
    if (isToday) row.setAttribute("aria-current", "date")
    else row.removeAttribute("aria-current")
    const marker = slot(row, "opening-hours-today")
    if (marker) marker.hidden = !isToday

    // Single-day rows show this week's special hours in place of the usual.
    const times = slot(row, "opening-hours-times")
    if (!times || days.length !== 1) continue
    times.dataset.regular ??= times.textContent ?? ""
    const dated = week.find((entry) => entry.day === days[0])
    if (dated?.special) {
      const text = formatRanges(dated.ranges, data.locale, data.labels)
      times.textContent = dated.special.label
        ? `${text} (${dated.special.label})`
        : text
      row.dataset.special = ""
    } else {
      times.textContent = times.dataset.regular
      delete row.dataset.special
    }
  }
}

function updateSpecial(el: HTMLElement, now: Date) {
  const data = readPayload(el)
  if (!data) return
  const { date } = zonedNow(now, data.timeZone)
  const items = el.querySelectorAll<HTMLElement>("[data-until]")
  let visible = 0
  for (const item of items) {
    item.hidden = (item.dataset.until ?? "") < date
    if (!item.hidden) visible++
  }
  el.hidden = visible === 0
}

function update() {
  const now = new Date()
  document
    .querySelectorAll<HTMLElement>('[data-slot="opening-hours-status"]')
    .forEach((el) => updateStatus(el, now))
  document
    .querySelectorAll<HTMLElement>('[data-slot="opening-hours-list"]')
    .forEach((el) => updateList(el, now))
  document
    .querySelectorAll<HTMLElement>('[data-slot="opening-hours-special"]')
    .forEach((el) => updateSpecial(el, now))
}

update()
// Refresh on each minute boundary, and when the tab becomes visible again
// (timers are throttled in background tabs).
setTimeout(
  () => {
    update()
    setInterval(update, 60_000)
  },
  60_000 - (Date.now() % 60_000)
)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") update()
})
