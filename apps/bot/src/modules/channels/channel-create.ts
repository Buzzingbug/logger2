import { GuildChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatChannel } from '@logger/utils';

export async function onChannelCreate(client: LoggerClient, channel: GuildChannel): Promise<void> {
  if (!channel.guild) return;

  await client.logger.log({
    guildId: channel.guild.id,
    eventType: 'channel_create',
    category: 'channels',
    channelId: channel.id,
    data: {
      channelCreate: {
        channel: formatChannel(channel as any),
      },
    },
  });
}