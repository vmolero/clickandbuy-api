import { connect, Redis } from '../../../deps.ts'
import config from '../../util/config.ts'
import log from '../LoggerService.ts'
import KeyValueStorable from './KeyValueStorable.ts'

class RedisKeyValueService implements KeyValueStorable {
  static async createKeyValueService(): Promise<KeyValueStorable> {
    const redisConnectionString = `redis://${config.redis.username}:${config.redis.password}@${config.redis.host}:${config.redis.port}/0`
    try {
      log.info(
        `Redis connection string [url=${redisConnectionString.replace(
          config.redis.password,
          '*****'
        )}]`
      )
      const redisClient = await connect({
        hostname: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        username: config.redis.username,
        db: 0
      })

      return new RedisKeyValueService({
        redis: redisClient
      }) as KeyValueStorable
    } catch (err) {
      throw new Error(
        `Redis Client Error [url=${redisConnectionString.replace(
          config.redis.password,
          '*****'
        )}]:  ${err.message}`
      )
    }
  }

  private redis: Redis

  constructor(source: { redis: Redis }) {
    this.redis = source.redis
  }
  async has(key: string) {
    const exists = await this.redis.exists(key)

    return !!exists
  }

  async get(key: string) {
    const result = await this.redis.get(key)

    return result as string
  }

  /**
   *
   * @param {string} key key for the cached value
   * @param {string} value value to be stored
   * @param {number|undefined} ttl in milliseconds, time to live, if not set, falls back to default 10 min
   * @returns {Promise<void>}
   */
  async put(key: string, value: string, ttl?: number | undefined) {
    const timeToLive = ttl
      ? Math.floor(ttl / 1000)
      : config.keyValueService.defaultTtl

    try {
      await this.redis.set(key, value, { ex: timeToLive })
    } catch (err) {
      log.error(
        `Failed to put redis key value [key=${key}, value=${value}]: ${err.message}`
      )
    }
  }
  delete(key: string) {
    return this.redis.del(key)
  }
  async clear() {
    await this.redis.flushall()
  }

  disconnect() {
    return this.redis.close()
  }
}

export default RedisKeyValueService
