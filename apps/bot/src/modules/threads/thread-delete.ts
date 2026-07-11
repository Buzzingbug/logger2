import { ThreadChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatChannel } from '@logger/utils';

export async function onThreadDelete(client: LoggerClient, thread: ThreadChannel): Promise<void> {
  if (!thread.guild) return;

  const parentChannel = thread.parent ? formatChannel(thread.parent as any) : null;

  await client.logger.log({
    guildId: thread.guild.id,
    eventType: 'thread_delete',
    category: 'threads',
    channelId: thread.parent?.id,
    data: {
      threadDelete: {
        name: thread.name,
        id: thread.id,
        parent: parentChannel,
      },
    },
  });
}