import {
  assertEquals,
  assertRejects,
  assertNotEquals,
  assertSpyCall,
  assertSpyCalls,
  returnsNext,
  stub,
  spy
} from '../../../../deps_dev.ts'

import RedisKeyValueService, {
  MinimumRedisProps
} from '../../../../src/services/storage/RedisKeyValueService.ts'

const RedisMock: MinimumRedisProps = {
  get: async () => 'there',
  set: async (key: string, value: string, opts?: { ex: number }) => value,
  exists: async () => 1,
  flushall: async () => 'bye',
  del: async () => 1,
  close: async () => {}
}

Deno.test('it should call redis set', async () => {
  const spyRedisSet = spy(RedisMock.set)
  const redisKeyValueService = new RedisKeyValueService({ redis: RedisMock })

  const value = await redisKeyValueService.put('hi', 'there')
  assertEquals(value, 'there')

  assertSpyCalls(spyRedisSet, 1)
})
