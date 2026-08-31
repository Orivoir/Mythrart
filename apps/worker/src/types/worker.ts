import type { Redis, Worker as BullmqWorker } from "@mythrart/redis"
import type { Logger } from "pino"

import type { WorkerEnv } from "../validations/env.schema.js"

export interface WorkerDependencies {
  connection: Redis
  env: WorkerEnv
  logger: Logger
}

export interface RegisteredWorker {
  name: string
  worker: BullmqWorker
}