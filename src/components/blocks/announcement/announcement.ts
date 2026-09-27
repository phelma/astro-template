/** Today's date as "YYYY-MM-DD" in `timeZone` (en-CA formats ISO dates). */
export function isoToday(timeZone: string, now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(now)
}

/** True when `today` is within `from`..`until` (inclusive, ISO date strings). */
export function isWithinDates(
  today: string,
  from?: string,
  until?: string
): boolean {
  return (!from || from <= today) && (!until || today <= until)
}

/**
 * Stable short key for a message (FNV-1a, base 36), used to remember a
 * dismissal: a new message gets a new key, so it shows again.
 */
export function announcementKey(message: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < message.length; i++) {
    hash ^= message.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}
