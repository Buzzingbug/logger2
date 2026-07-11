import { GuildMember } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser } from '@logger/utils';

export async function onMemberLeave(client: LoggerClient, member: GuildMember): Promise<void> {
  if (member.user.bot) return;

  await client.logger.log({
    guildId: member.guild.id,
    eventType: 'member_leave',
    category: 'members',
    userId: member.id,
    data: {
      memberLeave: {
        user: formatUser(member.user),
        memberCount: member.guild.memberCount,
      },
    },
  });
}