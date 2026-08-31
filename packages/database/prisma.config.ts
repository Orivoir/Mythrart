import { loadEnv } from "@mythrart/env"
import { defineConfig } from "prisma/config"

loadEnv()

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
