import js from "@eslint/js"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

export default tseslint.config(
  {
    ignores: ["node_modules/**", "coverage/**", "dist/**", "tests/**"],
  },

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier,
    ],
  },
)
