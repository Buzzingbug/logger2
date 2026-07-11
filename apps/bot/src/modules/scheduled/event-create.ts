import { GuildScheduledEvent, TextChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatChannel } from '@logger/utils';

export async function onGuildScheduledEventCreate(
  client: LoggerClient,
  event: GuildScheduledEvent,
): Promise<void> {
  if (!event.guild) return;

  const channel = event.channel as any;
  const channelData = channel ? formatChannel(channel) : null;

  await client.logger.log({
    guildId: event.guild.id,
    eventType: 'scheduled_event_create',
    category: 'scheduled',
    data: {
      scheduledEventCreate: {
        name: event.name,
        id: event.id,
        channel: channelData,
        startTime: event.scheduledStartAt?.toISOString() ?? null,
        endTime: event.scheduledEndAt?.toISOString() ?? null,
        status: event.status,
      },
    },
  });
}