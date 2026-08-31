import type { RegisteredWorker, WorkerDependencies } from "../types/index.js"

import { createExportWorker } from "./export.worker.js"
import { createSnapshotWorker } from "./snapshot.worker.js"

export function registerWorkers(dependencies: WorkerDependencies): RegisteredWorker[] {
  return [
    createSnapshotWorker(dependencies),
    createExportWorker(dependencies),
  ]
}