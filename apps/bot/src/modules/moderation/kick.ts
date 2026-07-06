import { GuildMember } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser } from '@logger/utils';

export async function onGuildMemberRemove(client: LoggerClient, member: GuildMember): Promise<void> {
  // This is also used for member_leave, but we check audit log to detect kicks
  const auditLogs = await member.guild.fetchAuditLogs({
    type: 2, // MEMBER_KICK
    limit: 1,
  });

  const kickLog = auditLogs.entries.first();
  if (kickLog && kickLog.target?.id === member.id) {
    const moderator = kickLog.executor;

    await client.logger.log({
      guildId: member.guild.id,
      eventType: 'mod_kick',
      category: 'moderation',
      userId: member.id,
      data: {
        modKick: {
          user: formatUser(member.user),
          moderator: moderator
            ? formatUser(moderator)
            : { id: 'unknown', tag: 'Unknown', avatarUrl: null, isBot: false },
          reason: kickLog.reason,
        },
      },
    });
  }
}
