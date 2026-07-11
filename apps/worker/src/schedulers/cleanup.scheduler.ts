import { Queue } from 'bullmq';
import { logger, redis } from '@logger/utils';

const cleanupQueue = new Queue('log-cleanup', {
  connection: redis,
});

const statsQueue = new Queue('stats-aggregation', {
  connection: redis,
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