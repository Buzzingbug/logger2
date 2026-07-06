import { redis } from '@logger/utils';

export class CacheService {
  async get(key: string): Promise<string | null> {
    return redis.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await redis.setex(key, ttl, value);
    } else {
      await redis.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }

  async has(key: string): Promise<boolean> {
    return (await redis.exists(key)) === 1;
  }

  async increment(key: string): Promise<number> {
    return redis.incr(key);
  }

  async decrement(key: string): Promise<number> {
    return redis.decr(key);
  }

  async setHash(key: string, field: string, value: string): Promise<void> {
    await redis.hset(key, field, value);
  }

  async getHash(key: string, field: string): Promise<string | null> {
    return redis.hget(key, field);
  }

  async getAllHash(key: string): Promise<Record<string, string>> {
    return redis.hgetall(key);
  }

  async publish(channel: string, message: string): Promise<void> {
    await redis.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    const subscriber = redis.duplicate();
    await subscriber.subscribe(channel);
    subscriber.on('message', (_ch, message) => {
      if (_ch === channel) callback(message);
    });
  }
}
