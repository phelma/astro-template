import js from "@eslint/js"
import astro from "eslint-plugin-astro"
import jsxA11y from "eslint-plugin-jsx-a11y"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  globalIgnores(["dist/", ".astro/", "node_modules/", ".agents/", ".claude/"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  // Astro components (+ Astro-aware jsx-a11y rules)
  astro.configs.recommended,
  astro.configs["jsx-a11y-recommended"],
  // React components (shadcn/ui and any islands)
  {
    files: ["**/*.{jsx,tsx}"],
    extends: [
      jsxA11y.flatConfigs.recommended,
      reactHooks.configs.flat.recommended,
    ],
  },
  // shadcn/ui primitives are generic wrappers: the control/association is
  // supplied by the consumer via props (e.g. <Label htmlFor>), which static
  // analysis can't see.
  {
    files: ["src/components/ui/**"],
    rules: {
      "jsx-a11y/label-has-associated-control": "off",
    },
  },
])
