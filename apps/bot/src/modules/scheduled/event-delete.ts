import { GuildScheduledEvent } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onGuildScheduledEventDelete(
  client: LoggerClient,
  event: GuildScheduledEvent,
): Promise<void> {
  if (!event.guild) return;

  await client.logger.log({
    guildId: event.guild.id,
    eventType: 'scheduled_event_delete',
    category: 'scheduled',
    data: {
      scheduledEventDelete: {
        name: event.name,
        id: event.id,
      },
    },
  });
}