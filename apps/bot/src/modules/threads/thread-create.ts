import { ThreadChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onThreadCreate(client: LoggerClient, thread: ThreadChannel): Promise<void> {
  if (!thread.guild) return;

  await client.logger.log({
    guildId: thread.guild.id,
    eventType: 'thread_create',
    category: 'threads',
    channelId: thread.parent?.id,
    data: {
      threadCreate: {
        name: thread.name,
        id: thread.id,
        parent: thread.parent ? { id: thread.parent.id, name: thread.parent.name } : null,
        autoArchiveDuration: thread.autoArchiveDuration,
      },
    },
  });
}
