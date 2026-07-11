import type { LoggerClient } from './core/client.js';
import { createClient } from './core/client.js';
import { registerEvents } from './events/event-router.js';
import { registerInteractionHandlers } from './events/interactions.js';
import { logger } from '@logger/utils';
import { env } from '@logger/config';

async function main() {
  const shardId = parseInt(process.env.SHARD_ID ?? '0');
  const shardCount = parseInt(process.env.SHARD_COUNT ?? '1');

  logger.info({ shardId, shardCount }, 'Initializing Logger bot...');

  const client = createClient(shardId, shardCount);

  registerEvents(client);
  registerInteractionHandlers(client);

  await client.login(env.DISCORD_TOKEN);

  logger.info(`Logger bot ready on shard ${shardId}/${shardCount}`);
}

main().catch((error) => {
  logger.fatal({ error }, 'Fatal error');
  process.exit(1);
});