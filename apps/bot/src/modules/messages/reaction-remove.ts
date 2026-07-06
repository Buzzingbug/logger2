import { MessageReaction, User } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser } from '@logger/utils';

export async function onMessageReactionRemove(
  client: LoggerClient,
  reaction: MessageReaction,
  user: User,
): Promise<void> {
  if (!reaction.message.guild) return;
  if (user.bot) return;

  await client.logger.log({
    guildId: reaction.message.guild.id,
    eventType: 'message_reaction_remove',
    category: 'messages',
    channelId: reaction.message.channel.id,
    userId: user.id,
    messageId: reaction.message.id,
    data: {
      messageReactionRemove: {
        user: formatUser(user),
        emoji: reaction.emoji.name || reaction.emoji.id || 'unknown',
      },
    },
  });
}
