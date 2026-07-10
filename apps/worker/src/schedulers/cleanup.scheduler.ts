import { Queue } from 'bullmq';
import { logger } from '@logger/utils';

function getRedisConnection() {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
  return {
    url,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };
}

const cleanupQueue = new Queue('log-cleanup', {
  connection: getRedisConnection(),
});

const statsQueue = new Queue('stats-aggregation', {
  connection: getRedisConnection(),
});

export function scheduleCleanup(): void {
  logger.info('Scheduling daily cleanup job');

  cleanupQueue.add(
    'daily-cleanup',
    {},
    {
      repeat: {
        pattern: '0 3 * * *',
      },
      jobId: 'daily-cleanup',
    },
  );
}

export function scheduleStatsAggregation(): void {
  logger.info('Scheduling hourly stats aggregation');

  statsQueue.add(
    'hourly-stats',
    {},
    {
      repeat: {
        pattern: '0 * * * *',
      },
      jobId: 'hourly-stats',
    },
  );
}

export function setupSchedulers(): void {
  scheduleCleanup();
}