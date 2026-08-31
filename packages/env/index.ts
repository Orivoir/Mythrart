import { resolve, dirname } from "node:path"
import { existsSync } from "node:fs"
import { config } from "dotenv"

// Locate the monorepo root by walking up from process.cwd() looking for the
// workspace marker file. import.meta.dirname/url can't be used reliably here
// since bundlers (e.g. Next.js/Turbopack) rewrite them to the build output
// location rather than the original source location.
function findMonorepoRoot(startDir: string): string {
  let dir = startDir

  while (true) {
    if (existsSync(resolve(dir, "pnpm-workspace.yaml"))) {
      return dir
    }

    const parent = dirname(dir)

    if (parent === dir) {
      // fallback: couldn't locate the marker, assume cwd is the root
      return startDir
    }

    dir = parent
  }
}

const monorepoRoot = findMonorepoRoot(process.cwd())

// Ensures env is only ever loaded once per process, so whichever mode loads
// first (e.g. the test setup file) always wins over later, transitive calls.
let hasLoaded = false

export const loadEnv = (mode: "dev" | "prod" | "test" = "dev") => {
  if (hasLoaded) return
  hasLoaded = true

  if(mode === "dev") {
    config({ path: resolve(monorepoRoot, ".env.local") })
  }
  if(mode === "test") {
    config({ path: resolve(monorepoRoot, ".env.test") })
  }

  if(mode === "prod") {
    /* Silence is golden */
    // in production env vars will injected by host (e.g., Vercel, Heroku)
  }


  // general config
  config({ path: resolve(monorepoRoot, ".env") })
}

