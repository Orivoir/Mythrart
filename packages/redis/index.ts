import IORedis, { type Redis } from "ioredis"

let redisConnection: Redis | null = null

export function getRedisConnection(): Redis {
  const redisUrl = process.env.REDIS_URL

  if (!redisUrl) {
    throw new Error("REDIS_URL is required to initialize Redis connection")
  }

  if (!redisConnection || redisConnection.status === "end") {
    redisConnection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    })
  }

  return redisConnection
}

export * from "ioredis"
export {Queue} from "bullmq"
