import { GuildMember } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser, formatDate } from '@logger/utils';

export async function onMemberJoin(client: LoggerClient, member: GuildMember): Promise<void> {
  if (member.user.bot) return;

  await client.logger.log({
    guildId: member.guild.id,
    eventType: 'member_join',
    category: 'members',
    userId: member.id,
    data: {
      memberJoin: {
        user: formatUser(member.user),
        accountCreated: formatDate(member.user.createdAt),
        memberCount: member.guild.memberCount,
      },
    },
  });
}
