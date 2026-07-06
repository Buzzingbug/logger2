import { Invite } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser } from '@logger/utils';

export async function onInviteCreate(client: LoggerClient, invite: Invite): Promise<void> {
  if (!invite.guild) return;

  await client.logger.log({
    guildId: invite.guild.id,
    eventType: 'invite_create',
    category: 'invites',
    channelId: invite.channel?.id,
    userId: invite.inviter?.id,
    data: {
      inviteCreate: {
        code: invite.code,
        inviter: invite.inviter ? formatUser(invite.inviter) : null,
        channel: invite.channel ? { id: invite.channel.id, name: invite.channel.name, mention: `<#${invite.channel.id}>` } : null,
        uses: invite.uses,
        maxUses: invite.maxUses,
        maxAge: invite.maxAge,
        temporary: invite.temporary,
      },
    },
  });
}
