import { Message, TextChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser, formatChannel } from '@logger/utils';

export async function onMessageDelete(client: LoggerClient, message: Message): Promise<void> {
  if (!message.guild || message.author?.bot) return;

  const channel = message.channel as TextChannel;
  if (!channel) return;

  let content = message.content;
  let attachments = message.attachments.map((a) => a.url);
  let embeds = message.embeds;

  if (message.partial) {
    try {
      const fetched = await message.fetch();
      content = fetched.content;
      attachments = fetched.attachments.map((a) => a.url);
      embeds = fetched.embeds;
    } catch {
      return;
    }
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