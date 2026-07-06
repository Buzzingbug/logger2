import { QueueScheduler } from 'bullmq';
import { prisma } from '@logger/db';
import { redis, logger } from '@logger/utils';
import { cleanupQueue } from '../queues/index.js';

// Schedule daily cleanup at 3 AM UTC
export function scheduleCleanup(): void {
  logger.info('Scheduling daily cleanup job');

  // Run cleanup every day at 3 AM UTC
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

// Schedule stats aggregation every hour
export function scheduleStatsAggregation(): void {
  logger.info('Scheduling hourly stats aggregation');

  const { statsQueue } = require('../queues/index.js');

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
  // scheduleStatsAggregation(); // Enable when ready
}
