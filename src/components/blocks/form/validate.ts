/**
 * Progressive enhancement for `<form data-form-validate>` (see Form.astro).
 * Without JS the browser's own constraint validation still runs.
 *
 * - Sets `novalidate` and shows inline error messages in each field's
 *   `[data-form-error]`, wiring `aria-invalid` and `aria-describedby`.
 * - Timing mirrors `:user-invalid`: a field is checked when the visitor
 *   leaves it after changing it, or on submit; after that it re-checks as
 *   they type so the error clears once fixed.
 * - On an invalid submit: fills the optional error summary and focuses it,
 *   otherwise focuses the first invalid control.
 * - Checkbox groups with `data-required-group` need at least one ticked.
 * - Inputs with `data-min-today` get `min` set to today's date.
 * - A filled honeypot blocks the submit; a valid submit marks the form
 *   pending (`aria-busy`, `data-pending` on the button) to stop double posts.
 * - `?sent` (or `?sent=<form id>`) in the URL swaps the form for its
 *   `[data-form-success]` panel, for provider redirects back to the page.
 *
 * Messages: `data-msg-<validity-key>` on the field (`data-msg-value-missing`,
 * `data-msg-type-mismatch`...) or `data-msg-invalid` as a catch-all, else the
 * defaults below. Works with any number of forms per page.
 */

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const FIELD = "[data-form-field]"
const CONTROLS =
  "input:not([type=hidden],[type=submit],[type=button],[type=reset],[data-form-honeypot]), select, textarea"

const validityKeys = [
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
  "tooShort",
  "tooLong",
  "rangeUnderflow",
  "rangeOverflow",
  "stepMismatch",
  "badInput",
] as const

type ValidityKey = (typeof validityKeys)[number]

/** A field's label or legend text, without the required/optional marker. */
function labelText(field: Element) {
  const label = field.querySelector("[data-slot=form-label]")?.cloneNode(true)
  if (!(label instanceof Element)) return ""
  label.querySelectorAll("[data-slot^=form-label-]").forEach((m) => m.remove())
  return (label.textContent ?? "").trim().replace(/\s+/g, " ")
}

/** Fallback wording. Edit here to change it site-wide. */
function defaultMessage(
  key: ValidityKey,
  control: Control,
  group: boolean,
  label: string
) {
  const type = control instanceof HTMLInputElement ? control.type : ""
  // "Preferred date" -> "preferred date" (keeps "WhatsApp", "VAT"...).
  const name = /^[A-Z][a-z]/.test(label)
    ? label[0].toLowerCase() + label.slice(1)
    : label
  switch (key) {
    case "valueMissing":
      if (group || type === "radio")
        return label && !label.endsWith("?")
          ? `Choose ${name}`
          : "Choose an option"
      if (control instanceof HTMLSelectElement)
        return name ? `Choose ${name}` : "Choose an option"
      if (type === "checkbox") return "Tick this box to continue"
      if (type === "file") return "Choose a file"
      return name ? `Enter ${name}` : "Fill in this field"
    case "typeMismatch":
      if (type === "email")
        return "Enter an email address, like name@example.com"
      if (type === "url") return "Enter a web address, like https://example.com"
      break
    case "patternMismatch":
      return control.title || "Enter it in the format shown"
    case "tooShort":
      return `Use at least ${(control as HTMLInputElement).minLength} characters`
    case "tooLong":
      return `Use ${(control as HTMLInputElement).maxLength} characters or fewer`
  }
  return control.validationMessage || "Check this field"
}

const msgAttr = (key: string) =>
  `data-msg-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`

function controlsOf(field: Element) {
  return [...field.querySelectorAll<Control>(CONTROLS)].filter(
    (c) => !c.disabled && c.closest(FIELD) === field
  )
}

/** The first problem in a field, or null when it's valid. */
function problem(field: HTMLElement) {
  const controls = controlsOf(field)
  if (!controls.length) return null
  const group = field.hasAttribute("data-form-group")

  if (field.hasAttribute("data-required-group")) {
    const checked = controls.some((c) => (c as HTMLInputElement).checked)
    if (!checked) {
      return {
        control: controls[0],
        message:
          field.getAttribute(msgAttr("valueMissing")) ??
          field.getAttribute("data-msg-invalid") ??
          defaultMessage("valueMissing", controls[0], true, labelText(field)),
      }
    }
  }

  const control = controls.find((c) => !c.validity.valid)
  if (!control) return null
  const key = validityKeys.find((k) => control.validity[k])
  const message =
    (key && field.getAttribute(msgAttr(key))) ??
    field.getAttribute("data-msg-invalid") ??
    (key
      ? defaultMessage(key, control, group, labelText(field))
      : control.validationMessage)
  return { control, message }
}

function setDescribedBy(el: Element, id: string, on: boolean) {
  const ids = new Set(
    (el.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean)
  )
  if (on) ids.add(id)
  else ids.delete(id)
  if (ids.size) el.setAttribute("aria-describedby", [...ids].join(" "))
  else el.removeAttribute("aria-describedby")
}

/** Validate one field and render its state. Returns the problem, if any. */
function check(field: HTMLElement) {
  const found = problem(field)
  const error = field.querySelector<HTMLElement>("[data-form-error]")
  const text = error?.querySelector("[data-form-error-text]")
  const controls = controlsOf(field)
  const group = field.hasAttribute("data-form-group")

  field.toggleAttribute("data-invalid", Boolean(found))
  for (const control of controls) {
    if (found) control.setAttribute("aria-invalid", "true")
    else control.removeAttribute("aria-invalid")
    if (error?.id && !group) setDescribedBy(control, error.id, Boolean(found))
  }
  if (error) {
    if (text) text.textContent = found?.message ?? ""
    error.hidden = !found
    if (error.id && group) setDescribedBy(field, error.id, Boolean(found))
  }
  return found
}

function renderSummary(
  form: HTMLFormElement,
  problems: Array<{ control: Control; message: string }>
) {
  const summary = form.querySelector<HTMLElement>("[data-form-error-summary]")
  const list = summary?.querySelector("ul")
  if (!summary || !list) return null
  list.replaceChildren(
    ...problems.map(({ control, message }) => {
      const item = document.createElement("li")
      const link = document.createElement("a")
      link.href = `#${control.id}`
      link.textContent = message
      link.addEventListener("click", (event) => {
        event.preventDefault()
        control.focus()
        control.scrollIntoView({ block: "center" })
      })
      item.append(link)
      return item
    })
  )
  summary.hidden = problems.length === 0
  return problems.length ? summary : null
}

function localToday() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function showSent(form: HTMLFormElement) {
  const panel = form.querySelector<HTMLElement>("[data-form-success]")
  if (!panel) return
  const param = form.dataset.sentParam || "sent"
  const value = new URLSearchParams(location.search).get(param)
  if (value === null) return
  if (!["", "1", "true", form.id].includes(value)) return
  for (const child of form.children) {
    if (child !== panel) (child as HTMLElement).hidden = true
  }
  form.setAttribute("data-sent", "")
  panel.hidden = false
  panel.focus()
}

function enhance(form: HTMLFormElement) {
  form.setAttribute("data-form-ready", "")
  form.noValidate = true
  const today = localToday()
  form
    .querySelectorAll<HTMLInputElement>("[data-min-today]")
    .forEach((input) => (input.min = today))

  const dirty = new WeakSet<Element>()
  const fieldOf = (target: EventTarget | null) =>
    target instanceof Element ? target.closest<HTMLElement>(FIELD) : null

  const onEdit = (event: Event) => {
    const field = fieldOf(event.target)
    if (!field) return
    dirty.add(field)
    // Re-check live once an error is showing (or after a submit attempt).
    if (
      field.hasAttribute("data-invalid") ||
      form.hasAttribute("data-submitted")
    )
      check(field)
  }
  form.addEventListener("input", onEdit)
  form.addEventListener("change", onEdit)

  form.addEventListener("focusout", (event) => {
    const field = fieldOf(event.target)
    if (!field || !dirty.has(field)) return
    // Moving between options of one group isn't leaving the field.
    if (fieldOf(event.relatedTarget) === field) return
    check(field)
  })

  form.addEventListener("submit", (event) => {
    if (form.hasAttribute("data-pending")) {
      event.preventDefault()
      return
    }
    const honeypot = form.querySelector<HTMLInputElement>(
      "[data-form-honeypot]"
    )
    if (honeypot?.value) {
      event.preventDefault()
      return
    }
    form.setAttribute("data-submitted", "")
    const problems = [...form.querySelectorAll<HTMLElement>(FIELD)]
      .map(check)
      .filter((p): p is NonNullable<typeof p> => Boolean(p))

    if (problems.length) {
      event.preventDefault()
      const summary = renderSummary(form, problems)
      if (summary) {
        summary.focus()
        summary.scrollIntoView({ block: "start" })
      } else problems[0].control.focus()
      return
    }
    renderSummary(form, [])
    form.setAttribute("data-pending", "")
    form.setAttribute("aria-busy", "true")
    const submitter = (event as SubmitEvent).submitter
    submitter?.setAttribute("data-pending", "")
    submitter?.setAttribute("aria-disabled", "true")
  })

  // Back/forward cache restores the page as it was: clear the pending state.
  addEventListener("pageshow", (event) => {
    if (!event.persisted) return
    form.removeAttribute("data-pending")
    form.removeAttribute("aria-busy")
    form.querySelectorAll("[data-pending]").forEach((el) => {
      el.removeAttribute("data-pending")
      el.removeAttribute("aria-disabled")
    })
  })

  showSent(form)
}

export function initForms(root: ParentNode = document) {
  root
    .querySelectorAll<HTMLFormElement>(
      "form[data-form-validate]:not([data-form-ready])"
    )
    .forEach(enhance)
}
