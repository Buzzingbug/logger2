import { Worker, Job } from 'bullmq';
import { prisma } from '@logger/db';
import { redis, logger } from '@logger/utils';

interface CleanupJobData {
  guildId: string;
  retentionDays: number;
}

export const cleanupWorker = new Worker(
  'log-cleanup',
  async (job: Job<CleanupJobData>) => {
    const { guildId, retentionDays } = job.data;

    logger.info({ guildId, retentionDays }, 'Running log cleanup');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Delete old log events
    const result = await prisma.logEvent.deleteMany({
      where: {
        guildId,
        createdAt: { lt: cutoffDate },
      },
    });

    logger.info({ guildId, deleted: result.count }, 'Log cleanup completed');

    return { deleted: result.count };
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

cleanupWorker.on('completed', (job) => {
  logger.debug({ jobId: job.id }, 'Cleanup job completed');
});

cleanupWorker.on('failed', (job, error) => {
  logger.error({ jobId: job?.id, error }, 'Cleanup job failed');
});
