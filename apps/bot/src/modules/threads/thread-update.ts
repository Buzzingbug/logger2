import { ThreadChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onThreadUpdate(
  client: LoggerClient,
  oldThread: ThreadChannel,
  newThread: ThreadChannel,
): Promise<void> {
  if (!newThread.guild) return;

  const changes: Array<{ field: string; old: string; new: string }> = [];

  if (oldThread.name !== newThread.name) {
    changes.push({ field: 'Name', old: oldThread.name, new: newThread.name });
  }

  if (oldThread.archived !== newThread.archived) {
    changes.push({ field: 'Archived', old: String(oldThread.archived), new: String(newThread.archived) });
  }

  if (changes.length === 0) return;

  await client.logger.log({
    guildId: newThread.guild.id,
    eventType: 'thread_update',
    category: 'threads',
    channelId: newThread.parent?.id,
    data: {
      threadUpdate: {
        name: newThread.name,
        id: newThread.id,
        changes,
      },
    },
  });
}