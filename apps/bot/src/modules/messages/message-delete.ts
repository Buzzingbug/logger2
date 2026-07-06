import { Events, Message, PartialMessage, TextChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser, formatChannel } from '@logger/utils';

export async function onMessageDelete(client: LoggerClient, message: Message | PartialMessage): Promise<void> {
  if (!message.guild) return;
  if (message.author?.bot) return;

  const channel = message.channel as TextChannel;
  if (!channel) return;

  let content = message.content;
  let attachments: string[] = [];
  let embeds: unknown[] = [];

  // Fetch full message if partial
  if (message.partial) {
    try {
      message = await message.fetch();
      content = message.content;
      attachments = message.attachments.map((a) => a.url);
      embeds = message.embeds;
    } catch {
      return; // Message may have been deleted before we could fetch
    }
  } else {
    attachments = message.attachments.map((a) => a.url);
    embeds = message.embeds;
  }

  await client.logger.log({
    guildId: message.guild.id,
    eventType: 'message_delete',
    category: 'messages',
    channelId: channel.id,
    userId: message.author?.id,
    messageId: message.id,
    data: {
      messageDelete: {
        content,
        author: formatUser(message.author!),
        channel: formatChannel(channel),
        attachments,
        embeds,
      },
    },
  });
}
