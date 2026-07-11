import { ShardingManager } from 'discord.js';
import { env } from '@logger/config';
import { logger } from '@logger/utils';

const manager = new ShardingManager('./dist/index.js', {
  token: env.DISCORD_TOKEN,
  totalShards: env.TOTAL_SHARDS === 'auto' ? 'auto' : parseInt(env.TOTAL_SHARDS),
  mode: process.env.NODE_ENV === 'production' ? 'worker' : 'process',
  respawn: true,
});

manager.on('shardCreate', (shard) => {
  logger.info(`[Shard ${shard.id}] Launched`);

  shard.on('ready', () => {
    logger.info(`[Shard ${shard.id}] Ready`);
  });

  shard.on('death', (process) => {
    if (process.pid) {
      logger.error(`[Shard ${shard.id}] Died (PID: ${process.pid})`);
    }
  });

  shard.on('error', (error) => {
    logger.error({ shardId: shard.id, error }, `[Shard ${shard.id}] Error`);
  });

  shard.on('disconnect', () => {
    logger.warn(`[Shard ${shard.id}] Disconnected`);
  });
});

manager.on('error', (error) => {
  logger.error({ error }, 'ShardingManager error');
});

logger.info('Starting Logger bot...');

manager.spawn({ timeout: 30_000 }).catch((error) => {
  logger.fatal({ error }, 'Failed to spawn shards');
  process.exit(1);
});