import { defineConfig } from "vitest/config"
// import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  // Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option.
  // You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.
  // plugins: [tsconfigPaths()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["tests/api/**/*.test.ts"],
    fileParallelism: false,
    setupFiles: ["tests/helpers/setup-env.ts", "tests/helpers/setup.ts"],
  },
})
