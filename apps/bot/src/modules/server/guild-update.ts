import { Guild } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import type { ServerChange } from '@logger/types';

export async function onGuildUpdate(
  client: LoggerClient,
  oldGuild: Guild,
  newGuild: Guild,
): Promise<void> {
  const changes: ServerChange[] = [];

  if (oldGuild.name !== newGuild.name) {
    changes.push({ field: 'Name', old: oldGuild.name, new: newGuild.name });
  }

  if (oldGuild.iconURL() !== newGuild.iconURL()) {
    changes.push({
      field: 'Icon',
      old: oldGuild.iconURL() || '*(none)*',
      new: newGuild.iconURL() || '*(none)*',
    });
  }

  if (oldGuild.description !== newGuild.description) {
    changes.push({
      field: 'Description',
      old: oldGuild.description || '*(none)*',
      new: newGuild.description || '*(none)*',
    });
  }

  if (changes.length === 0) return;

  await client.logger.log({
    guildId: newGuild.id,
    eventType: 'server_update',
    category: 'server',
    data: {
      serverUpdate: {
        oldName: oldGuild.name,
        newName: newGuild.name,
        oldIcon: oldGuild.iconURL(),
        newIcon: newGuild.iconURL(),
        changes,
      },
    },
  });
}
