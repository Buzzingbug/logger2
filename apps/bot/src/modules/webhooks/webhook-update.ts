import { Guild, TextChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onWebhookUpdate(
  client: LoggerClient,
  guild: Guild,
  channel: TextChannel,
): Promise<void> {
  await client.logger.log({
    guildId: guild.id,
    eventType: 'webhook_update',
    category: 'webhooks',
    channelId: channel.id,
    data: {
      webhookUpdate: {
        channel: { id: channel.id, name: channel.name, mention: channel.toString() },
      },
    },
  });
}
