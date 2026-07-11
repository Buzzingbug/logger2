import { Guild, TextChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onWebhookUpdate(
  client: LoggerClient,
  channel: TextChannel,
): Promise<void> {
  if (!channel.guild) return;

  await client.logger.log({
    guildId: channel.guild.id,
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