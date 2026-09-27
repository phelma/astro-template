/**
 * Props shared by the opening-hours components and their defaults from
 * `siteConfig.business` / `siteConfig.locale`. Build-time only (imports the
 * site config); the browser script gets the resolved data as JSON.
 */
import {
  defaultHoursLabels,
  type HoursData,
  type HoursLabels,
} from "@/lib/hours"
import {
  siteConfig,
  type BusinessHours,
  type SpecialHours,
} from "@/site.config"

export interface HoursProps {
  /** Weekly hours. Defaults to `siteConfig.business.hours`. */
  hours?: BusinessHours
  /** Exceptions. Defaults to `siteConfig.business.specialHours`. */
  specialHours?: SpecialHours
  /** IANA time zone. Defaults to `siteConfig.business.timeZone`. */
  timeZone?: string
  /** Formatting locale. Defaults to `siteConfig.locale`. */
  locale?: string
  /** Override any status/summary copy. */
  labels?: Partial<HoursLabels>
}

export interface ResolvedHours extends HoursData {
  labels: HoursLabels
}

export function resolveHours(props: HoursProps): ResolvedHours {
  const { business, locale } = siteConfig
  return {
    hours: props.hours ?? business.hours,
    specialHours: props.specialHours ?? business.specialHours,
    timeZone: props.timeZone ?? business.timeZone,
    locale: props.locale ?? locale,
    labels: { ...defaultHoursLabels, ...props.labels },
  }
}

/** Payload for the client script (`data-hours`). */
export function hoursJson(data: ResolvedHours, extra: object = {}): string {
  return JSON.stringify({ ...data, ...extra })
}
