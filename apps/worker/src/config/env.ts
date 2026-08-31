import {loadEnv as proxyLoadEnv} from "@mythrart/env"
import {workerEnvSchema, type WorkerEnv} from "../validations/env.schema.js"

let cachedEnv: WorkerEnv | null = null

export function loadEnv(): WorkerEnv {

  // in production env variables should be set by the hosting provider
  if(process.env.NODE_ENV === "prod" ) {
    return process.env as unknown as WorkerEnv
  }

  if(cachedEnv) {
    return cachedEnv
  }

  proxyLoadEnv()


  cachedEnv = workerEnvSchema.parse(process.env)

  return cachedEnv
}