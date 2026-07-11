import { Invite } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser, formatChannel } from '@logger/utils';

export async function onInviteCreate(client: LoggerClient, invite: Invite): Promise<void> {
  if (!invite.guild) return;

  const channel = invite.channel as any;
  const channelData = channel ? { id: channel.id, name: channel.name, mention: `<#${channel.id}>`, type: channel.type.toString() } : null;

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
        channel: channelData,
        uses: invite.uses ?? 0,
        maxUses: invite.maxUses ?? 0,
        maxAge: invite.maxAge ?? 0,
        temporary: invite.temporary ?? false,
      },
    },
  });
}