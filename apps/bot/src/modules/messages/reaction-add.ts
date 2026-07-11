import { MessageReaction, User } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser } from '@logger/utils';

export async function onMessageReactionAdd(
  client: LoggerClient,
  reaction: MessageReaction,
  user: User,
): Promise<void> {
  if (!reaction.message.guild || user.bot) return;

  await client.logger.log({
    guildId: reaction.message.guild.id,
    eventType: 'message_reaction_add',
    category: 'messages',
    channelId: reaction.message.channel.id,
    userId: user.id,
    messageId: reaction.message.id,
    data: {
      messageReactionAdd: {
        user: formatUser(user),
        emoji: reaction.emoji.name || reaction.emoji.id || 'unknown',
        messageContent: reaction.message.content?.slice(0, 200) || '*(no content)*',
      },
    },
  });
}