import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/tests/performance/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["**/*.ts"],
      exclude: [
        "**/tests/**",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.d.ts",
        "**/vitest.config.*",
        "**/node_modules/**",
        "**/dist/**",
        "**/coverage/**",
      ],
    },
  },
})