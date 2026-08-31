import type { Logger } from "pino"

let shuttingDown = false

export function registerShutdownHandlers(
  shutdown: (signal: NodeJS.Signals) => Promise<void>,
  logger: Logger,
): void {
  const handleSignal = (signal: NodeJS.Signals) => {
    if (shuttingDown) {
      return
    }

    shuttingDown = true

    void shutdown(signal)
      .catch((error) => {
        logger.error({ err: error, signal }, "Worker shutdown failed")
        process.exitCode = 1
      })
      .finally(() => {
        process.exit()
      })
  }

  process.once("SIGINT", handleSignal)
  process.once("SIGTERM", handleSignal)
}