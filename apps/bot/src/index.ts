
import { createClient } from './core/client.js';
import { registerInteractionHandlers } from './events/interactions.js';
import { logger } from '@logger/utils';
import { env } from '@logger/config';

async function main() {
  const shardId = parseInt(process.env.SHARD_ID ?? '0');
  const shardCount = parseInt(process.env.SHARD_COUNT ?? '1');

  logger.info({ shardId, shardCount }, 'Initializing Logger bot...');

  const client = createClient(shardId, shardCount);

  registerInteractionHandlers(client);

  await client.login(env.DISCORD_TOKEN);

  // Sync existing guilds to the database
  try {
    const { prisma } = await import('@logger/db');
    const guilds = client.guilds.cache;
    logger.info(`Syncing ${guilds.size} guilds to the database...`);
    
    for (const [id, guild] of guilds) {
      await prisma.guild.upsert({
        where: { guildId: id },
        update: {
          name: guild.name,
          iconUrl: guild.iconURL(),
        },
        create: {
          guildId: id,
          name: guild.name,
          iconUrl: guild.iconURL(),
        },
      });
    }
    logger.info('Successfully synced all guilds');
  } catch (error) {
    logger.error({ error }, 'Failed to sync guilds on startup');
  }

  logger.info(`Logger bot ready on shard ${shardId}/${shardCount}`);
}

main().catch((error) => {
  logger.fatal({ error }, 'Fatal error');
  process.exit(1);
});