/**
 * Pure helpers and types shared by the form parts and the validation script.
 */

/** An option for `ChoiceGroup` (radio / checkbox) or a select. */
export interface FormOption {
  value: string
  label: string
  /** Secondary line under the label. */
  description?: string
  /** astro-icon name, e.g. "lucide:droplets" (choice cards only). */
  icon?: string
  disabled?: boolean
}

/**
 * Custom validation messages, keyed like `ValidityState`. Rendered as
 * `data-msg-*` attributes on the field and read by the validation script.
 * `invalid` is the fallback for any other failure.
 */
export interface FieldMessages {
  valueMissing?: string
  typeMismatch?: string
  patternMismatch?: string
  tooShort?: string
  tooLong?: string
  rangeUnderflow?: string
  rangeOverflow?: string
  invalid?: string
}

const messageAttr: Record<keyof FieldMessages, string> = {
  valueMissing: "data-msg-value-missing",
  typeMismatch: "data-msg-type-mismatch",
  patternMismatch: "data-msg-pattern-mismatch",
  tooShort: "data-msg-too-short",
  tooLong: "data-msg-too-long",
  rangeUnderflow: "data-msg-range-underflow",
  rangeOverflow: "data-msg-range-overflow",
  invalid: "data-msg-invalid",
}

/** `{ valueMissing: "..." }` -> `{ "data-msg-value-missing": "..." }`. */
export function messageAttributes(messages: FieldMessages = {}) {
  return Object.fromEntries(
    Object.entries(messages)
      .filter(([, text]) => text)
      .map(([key, text]) => [messageAttr[key as keyof FieldMessages], text])
  ) as Record<string, string>
}

/** Ids of a field's parts, derived from the control id. */
export function fieldIds(id: string) {
  return {
    control: id,
    label: `${id}-label`,
    description: `${id}-description`,
    error: `${id}-error`,
  }
}

/** Join ids for `aria-describedby`, dropping empty ones. */
export function describedBy(...ids: Array<string | false | null | undefined>) {
  return ids.filter(Boolean).join(" ") || undefined
}

/** "Your name" -> "your-name": stable ids from labels. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
