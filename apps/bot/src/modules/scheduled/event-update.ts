import { GuildScheduledEvent } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onGuildScheduledEventUpdate(
  client: LoggerClient,
  oldEvent: GuildScheduledEvent,
  newEvent: GuildScheduledEvent,
): Promise<void> {
  if (!newEvent.guild) return;

  const changes: Array<{ field: string; old: string; new: string }> = [];

  if (oldEvent.name !== newEvent.name) {
    changes.push({ field: 'Name', old: oldEvent.name, new: newEvent.name });
  }

  if (oldEvent.status !== newEvent.status) {
    changes.push({ field: 'Status', old: String(oldEvent.status), new: String(newEvent.status) });
  }

  if (changes.length === 0) return;

  await client.logger.log({
    guildId: newEvent.guild.id,
    eventType: 'scheduled_event_update',
    category: 'scheduled',
    data: {
      scheduledEventUpdate: {
        name: newEvent.name,
        id: newEvent.id,
        changes,
      },
    },
  });
}