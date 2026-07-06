import { GuildBan } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser } from '@logger/utils';

export async function onGuildBanRemove(client: LoggerClient, ban: GuildBan): Promise<void> {
  const executor = ban.guild.members.me;

  await client.logger.log({
    guildId: ban.guild.id,
    eventType: 'mod_unban',
    category: 'moderation',
    userId: ban.user.id,
    data: {
      modUnban: {
        user: formatUser(ban.user),
        moderator: executor
          ? formatUser(executor.user)
          : { id: 'unknown', tag: 'Unknown', avatarUrl: null, isBot: false },
        reason: ban.reason,
      },
    },
  });
}
