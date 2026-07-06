import { GuildScheduledEvent } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onGuildScheduledEventCreate(
  client: LoggerClient,
  event: GuildScheduledEvent,
): Promise<void> {
  await client.logger.log({
    guildId: event.guild.id,
    eventType: 'scheduled_event_create',
    category: 'scheduled',
    data: {
      scheduledEventCreate: {
        name: event.name,
        id: event.id,
        channel: event.channel ? { id: event.channel.id, name: event.channel.name } : null,
        startTime: event.scheduledStartAt?.toISOString(),
        endTime: event.scheduledEndAt?.toISOString(),
        status: event.status,
      },
    },
  });
}
