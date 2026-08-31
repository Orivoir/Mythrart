import { loadEnv } from "@mythrart/env"

// Must run before any other setup/test file so .env.test is loaded first.
loadEnv("test")
