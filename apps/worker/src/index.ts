import type { Logger } from "pino"
import { loadEnv } from "./config/env.js"
import { getLogger } from "./config/logger.js"
import { closePrisma, connectPrisma } from "./config/prisma.js"
import { closeRedisConnection, connectRedis } from "./config/redis.js"
import type { RegisteredWorker } from "./types/worker.js"
import { registerShutdownHandlers } from "./utils/shutdown.js"
import { registerWorkers } from "./workers/index.js"

async function waitForWorkers(workers: RegisteredWorker[]): Promise<void> {
  await Promise.all(workers.map(async ({ worker }) => worker.waitUntilReady()))
}

async function shutdown(
  logger: Logger,
  workers: RegisteredWorker[],
  signal: NodeJS.Signals,
): Promise<void> {
  logger.info({ signal }, "Shutting down worker application")

  await Promise.allSettled(
    workers.map(async ({ name, worker }) => {
      await worker.close()
      logger.info({ worker: name }, "Worker closed")
    }),
  )

  await Promise.allSettled([
    closeRedisConnection(),
    closePrisma(),
  ])

  logger.info({ signal }, "Worker application stopped")
}

async function bootstrap(): Promise<void> {
  const env = loadEnv()

  const logger = getLogger(env)
  const redis = await connectRedis(env)
  await connectPrisma()

  const workers = registerWorkers({
    connection: redis,
    env,
    logger,
  })

  await waitForWorkers(workers)

  registerShutdownHandlers((signal) => shutdown(logger, workers, signal), logger)

  logger.info(
    {
      pid: process.pid,
      workerCount: workers.length,
      workers: workers.map(({ name }) => name),
    },
    `Worker application started in ${env.NODE_ENV} mode`,
  )
}

bootstrap().catch(async (error) => {
  try {
    const logger = getLogger(loadEnv())

    logger.error({ err: error }, "Worker application failed to start")
  } catch (loggerError) {
    console.error("Worker application failed to start", {
      error,
      loggerError,
    })
  }

  await Promise.allSettled([
    closeRedisConnection(),
    closePrisma(),
  ])

  process.exitCode = 1
})