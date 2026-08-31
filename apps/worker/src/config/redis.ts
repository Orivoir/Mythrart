import type { WorkerEnv } from "./../validations/env.schema.js"
import {Redis, getRedisConnection} from "@mythrart/redis"


export function getRedis(): Redis {
  return getRedisConnection() // already cached connection
}

export async function connectRedis(
  _?: WorkerEnv // dead code for backward compatibility
): Promise<Redis> {
  const connection = getRedis()

  if (connection.status === "wait") {
    await connection.connect()
  }

  return connection
}

export async function closeRedisConnection(): Promise<void> {

  const redis = getRedis()

  if (!redis) {
    return
  }

  if (redis.status === "ready" || redis.status === "connect") {
    await redis.quit()
  } else {
    redis.disconnect()
  }
}