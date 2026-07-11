import '@logger/config';
import { logger } from '@logger/utils';
import { logWorker, cleanupWorker } from './workers/index.js';
import { setupSchedulers } from './schedulers/cleanup.scheduler.js';
import { prisma } from '@logger/db';

async function main() {
  logger.info('Starting Logger worker...');

  // Test database connection
  await prisma.$connect();
  logger.info('Database connected');

  // Setup scheduled jobs
  setupSchedulers();

  logger.info('Worker started and ready to process jobs');

  // Graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down worker...');

    await logWorker.close();
    await cleanupWorker.close();
    await prisma.$disconnect();

    logger.info('Worker shut down gracefully');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  logger.fatal({ error }, 'Fatal error in worker');
  process.exit(1);
});