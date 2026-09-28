/**
 * Colour-mode + theme bootstrap.
 *
 * `themeScript` is rendered as a blocking `<script is:inline>` in <head>
 * (see BaseLayout) so `.dark`, `data-theme`, `data-color-mode`,
 * `<meta name="color-scheme">` and `<meta name="theme-color">` are correct
 * before first paint (no FOUC).
 *
 * It also exposes `window.siteTheme` which the ThemeToggle / ThemeSwitcher
 * components use.
 */
import { siteConfig } from "@/site.config"
import { themes } from "@/styles/themes"

export const COLOR_MODE_STORAGE_KEY = "color-mode"
export const THEME_STORAGE_KEY = "theme"

export type ColorModePreference = "light" | "dark" | "system"

export interface SiteThemeApi {
  getMode(): ColorModePreference
  setMode(mode: ColorModePreference): void
  getTheme(): string
  setTheme(theme: string): void
}

declare global {
  interface Window {
    siteTheme?: SiteThemeApi
  }
  interface DocumentEventMap {
    "site-theme-change": CustomEvent<{
      mode: ColorModePreference
      theme: string
      dark: boolean
    }>
  }
}

const bootConfig = {
  mode: siteConfig.colorMode.default,
  theme: siteConfig.theme.default,
  themes: siteConfig.theme.available,
  colors: Object.fromEntries(
    siteConfig.theme.available.map((name) => [name, themes[name].themeColor])
  ),
  keys: { mode: COLOR_MODE_STORAGE_KEY, theme: THEME_STORAGE_KEY },
}

// Keep this ES2017-ish and tiny. It runs before CSS and before <body>.
export const themeScript = `(function(){var c=${JSON.stringify(bootConfig)};var d=document.documentElement;var mq=matchMedia("(prefers-color-scheme: dark)");var mem={};function get(k){try{var v=localStorage.getItem(k);if(v!==null)return v}catch(e){}return mem[k]||null}function set(k,v){mem[k]=v;try{localStorage.setItem(k,v)}catch(e){}}function mode(){var m=get(c.keys.mode);return m==="light"||m==="dark"||m==="system"?m:c.mode}function theme(){var t=get(c.keys.theme);return c.themes.indexOf(t)>-1?t:c.theme}function apply(){var m=mode(),t=theme(),dark=m==="dark"||(m==="system"&&mq.matches);d.classList.toggle("dark",dark);d.setAttribute("data-theme",t);d.setAttribute("data-color-mode",m);var tc=c.colors[t][dark?"dark":"light"];document.querySelectorAll('meta[name="theme-color"]').forEach(function(el){el.setAttribute("content",tc);el.removeAttribute("media")});var cs=document.querySelector('meta[name="color-scheme"]');if(cs)cs.setAttribute("content",dark?"dark":"light");document.dispatchEvent(new CustomEvent("site-theme-change",{detail:{mode:m,theme:t,dark:dark}}))}apply();mq.addEventListener("change",function(){if(mode()==="system")apply()});addEventListener("storage",function(e){if(e.key===c.keys.mode||e.key===c.keys.theme)apply()});window.siteTheme={getMode:mode,getTheme:theme,setMode:function(m){set(c.keys.mode,m);apply()},setTheme:function(t){if(c.themes.indexOf(t)>-1){set(c.keys.theme,t);apply()}}}})();`
