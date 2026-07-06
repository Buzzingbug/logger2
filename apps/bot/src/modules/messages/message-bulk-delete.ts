import { Collection, Message, Snowflake, TextChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser, formatChannel } from '@logger/utils';

export async function onMessageDeleteBulk(
  client: LoggerClient,
  messages: Collection<Snowflake, Message | PartialMessage>,
): Promise<void> {
  if (!messages.first()?.guild) return;

  const guild = messages.first()!.guild!;
  const channel = messages.first()!.channel as TextChannel;

  const deletedMessages = messages.map((msg) => ({
    id: msg.id,
    content: msg.content || '*(no content)*',
    author: msg.author ? formatUser(msg.author) : { id: 'unknown', tag: 'Unknown', avatarUrl: null, isBot: false },
  }));

  await client.logger.log({
    guildId: guild.id,
    eventType: 'message_delete_bulk',
    category: 'messages',
    channelId: channel.id,
    data: {
      messageDeleteBulk: {
        count: messages.size,
        channel: formatChannel(channel),
        messages: deletedMessages,
      },
    },
  });
}
