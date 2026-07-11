import { Worker, Job } from 'bullmq';
import { prisma } from '@logger/db';
import { logger } from '@logger/utils';

function getRedisConnection() {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
  return {
    url,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };
}

interface CleanupJobData {
  guildId?: string;
  retentionDays?: number;
}

export const cleanupWorker = new Worker(
  'log-cleanup',
  async (job: Job<CleanupJobData>) => {
    const { guildId, retentionDays } = job.data || {};

    if (!guildId) {
      logger.info('Running global log cleanup');
      const guilds = await prisma.guild.findMany({ select: { guildId: true, retentionDays: true } });
      
      let totalDeleted = 0;
      for (const guild of guilds) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - guild.retentionDays);
        
        const result = await prisma.logEvent.deleteMany({
          where: {
            guildId: guild.guildId,
            createdAt: { lt: cutoff },
          },
        });
        totalDeleted += result.count;
      }
      
      // Compliance: Delete messages older than 24h
      const complianceCutoff = new Date();
      complianceCutoff.setHours(complianceCutoff.getHours() - 24);
      
      const complianceResult = await prisma.logEvent.deleteMany({
        where: {
          category: 'messages',
          createdAt: { lt: complianceCutoff },
        },
      });
      
      logger.info({ deletedGeneral: totalDeleted, deletedCompliance: complianceResult.count }, 'Global log cleanup completed');
      return { deleted: totalDeleted + complianceResult.count };
    }

    logger.info({ guildId, retentionDays }, 'Running log cleanup for guild');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (retentionDays ?? 90));

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
    connection: getRedisConnection(),
    concurrency: 5,
  },
);

cleanupWorker.on('completed', (job) => {
  logger.debug({ jobId: job.id }, 'Cleanup job completed');
});

cleanupWorker.on('failed', (job, error) => {
  logger.error({ jobId: job?.id, error }, 'Cleanup job failed');
});