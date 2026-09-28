/*
 * <site-announcement> custom element: dismissible announcement banners.
 *
 * Loaded as a classic, parser-blocking external script placed just before a
 * dismissible banner (see Announcement.astro). The element is defined before
 * the banner is parsed, so the parser upgrades it on creation and
 * connectedCallback hides an already-dismissed banner before first paint: no
 * flash, and as an external file it is cached rather than inlined per page.
 * Plain browser JS with no imports: it is emitted as-is via `?url`.
 */
;(function () {
  if (!("customElements" in window)) return
  if (customElements.get("site-announcement")) return

  var PREFIX = "announcement-dismissed:"

  function isDismissed(key) {
    try {
      return localStorage.getItem(PREFIX + key) === "1"
    } catch {
      return false
    }
  }

  function remember(key) {
    try {
      localStorage.setItem(PREFIX + key, "1")
    } catch {
      // Storage unavailable: dismissed for this page view only.
    }
  }

  customElements.define(
    "site-announcement",
    class extends HTMLElement {
      connectedCallback() {
        var key = this.getAttribute("data-key")
        if (!key || !this.hasAttribute("data-dismissible")) return
        if (isDismissed(key)) {
          this.hidden = true
          return
        }
        if (this.dataset.wired) return
        this.dataset.wired = ""
        this.addEventListener("click", function (event) {
          var target = event.target
          if (!(target instanceof Element)) return
          if (!target.closest("[data-announcement-dismiss]")) return
          remember(key)
          this.hidden = true
        })
      }
    }
  )
})()
