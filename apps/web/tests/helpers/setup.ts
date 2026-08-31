import { afterAll, beforeEach } from "vitest"
import prisma from "./prisma"
import resetDb from "./reset-db"

beforeEach(async () => {
  if (process.env.RESET_DB === "1") {
    await resetDb()
  }
})

afterAll(async () => {
  await prisma.$disconnect()
})
