import { ThreadChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onThreadDelete(client: LoggerClient, thread: ThreadChannel): Promise<void> {
  if (!thread.guild) return;

  await client.logger.log({
    guildId: thread.guild.id,
    eventType: 'thread_delete',
    category: 'threads',
    channelId: thread.parent?.id,
    data: {
      threadDelete: {
        name: thread.name,
        id: thread.id,
        parent: thread.parent ? { id: thread.parent.id, name: thread.parent.name } : null,
      },
    },
  });
}
