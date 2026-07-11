import { GuildChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatChannel } from '@logger/utils';
import type { ChannelChange } from '@logger/types';

export async function onChannelUpdate(
  client: LoggerClient,
  oldChannel: GuildChannel,
  newChannel: GuildChannel,
): Promise<void> {
  if (!newChannel.guild) return;

  const changes: ChannelChange[] = [];

  if (oldChannel.name !== newChannel.name) {
    changes.push({ field: 'Name', old: oldChannel.name, new: newChannel.name });
  }

  if (oldChannel.position !== newChannel.position) {
    changes.push({ field: 'Position', old: String(oldChannel.position), new: String(newChannel.position) });
  }

  if ('topic' in oldChannel && 'topic' in newChannel) {
    if ((oldChannel as any).topic !== (newChannel as any).topic) {
      changes.push({
        field: 'Topic',
        old: (oldChannel as any).topic || '*(none)*',
        new: (newChannel as any).topic || '*(none)*',
      });
    }
  }

  if (changes.length === 0) return;

  await client.logger.log({
    guildId: newChannel.guild.id,
    eventType: 'channel_update',
    category: 'channels',
    channelId: newChannel.id,
    data: {
      channelUpdate: {
        oldChannel: formatChannel(oldChannel as any),
        newChannel: formatChannel(newChannel as any),
        changes,
      },
    },
  });
}