import { Worker, Job } from 'bullmq';
import { prisma } from '@logger/db';
import { logger, redis } from '@logger/utils';

interface LogJobData {
  guildId: string;
  eventType: string;
  category: string;
  channelId?: string;
  userId?: string;
  messageId?: string;
  data: Record<string, unknown>;
  embedColor?: string;
  embedTitle?: string;
}

export const logWorker = new Worker(
  'log-processing',
  async (job: Job<LogJobData>) => {
    const { guildId, eventType, category, channelId, userId, messageId, data, embedColor, embedTitle } = job.data;

    logger.debug({ jobId: job.id, guildId, eventType }, 'Processing log job');

    // Store in database
    const event = await prisma.logEvent.create({
      data: {
        guildId,
        eventType,
        category,
        channelId,
        userId,
        messageId,
        data: data as object,
        embedColor,
        embedTitle,
      },
    });

    // Update daily stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const categoryField: Record<string, string> = {
      messages: 'messageEvents',
      members: 'memberEvents',
      voice: 'voiceEvents',
      moderation: 'modEvents',
    };

    const field = categoryField[category];
    if (field) {
      await prisma.dailyStats.upsert({
        where: { guildId_date: { guildId, date: today } },
        create: {
          guildId,
          date: today,
          totalEvents: 1,
          [field]: 1,
        },
        update: {
          totalEvents: { increment: 1 },
          [field]: { increment: 1 },
        },
      });
    }

    return { eventId: event.id };
  },
  {
    connection: redis as any,
    concurrency: 10,
    limiter: {
      max: 100,
      duration: 1000,
    },
  },
);

logWorker.on('completed', (job) => {
  logger.debug({ jobId: job.id }, 'Log job completed');
});

logWorker.on('failed', (job, error) => {
  logger.error({ jobId: job?.id, error }, 'Log job failed');
});