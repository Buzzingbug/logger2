import { Queue, Worker, QueueScheduler } from 'bullmq';
import { redis } from '@logger/utils';
import { logger } from '@logger/utils';

// Queue definitions
export const logQueue = new Queue('log-processing', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: { age: 3600, count: 1000 },
    removeOnFail: { age: 86400, count: 5000 },
  },
});

export const statsQueue = new Queue('stats-aggregation', {
  connection: redis,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: { age: 86400 },
  },
});

export const cleanupQueue = new Queue('log-cleanup', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'fixed',
      delay: 10000,
    },
    removeOnComplete: true,
    removeOnFail: { age: 86400 },
  },
});

// Queue schedulers
new QueueScheduler('log-processing', { connection: redis.duplicate() });
new QueueScheduler('stats-aggregation', { connection: redis.duplicate() });
new QueueScheduler('log-cleanup', { connection: redis.duplicate() });
