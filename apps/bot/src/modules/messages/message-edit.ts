import { Message, TextChannel } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser, formatChannel, diffWords } from '@logger/utils';

export async function onMessageUpdate(
  client: LoggerClient,
  oldMessage: Message,
  newMessage: Message,
): Promise<void> {
  if (!oldMessage.guild || oldMessage.author?.bot) return;
  if (oldMessage.content === newMessage.content) return;

  const channel = oldMessage.channel as TextChannel;
  if (!channel) return;

  const diff = diffWords(oldMessage.content, newMessage.content);

  await client.logger.log({
    guildId: oldMessage.guild.id,
    eventType: 'message_edit',
    category: 'messages',
    channelId: channel.id,
    userId: oldMessage.author.id,
    messageId: oldMessage.id,
    data: {
      messageEdit: {
        oldContent: oldMessage.content,
        newContent: newMessage.content,
        author: formatUser(oldMessage.author),
        channel: formatChannel(channel),
        diff,
      },
    },
  });
}