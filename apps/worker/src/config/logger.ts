import pino, { type Logger } from "pino"

import type { WorkerEnv } from "../validations/env.schema.js"

let logger: Logger | null = null

export function getLogger(env: WorkerEnv): Logger {

  const devOptions = {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  }

  const loggerDevOptions = process.env.NODE_ENV !== "production" ? devOptions : {}

  if (!logger) {
    logger = pino({
      name: "mythrart-worker",
      level: env.LOG_LEVEL,
      base: {
        pid: process.pid,
      },
      ...(loggerDevOptions),
    })
  }

  return logger
}