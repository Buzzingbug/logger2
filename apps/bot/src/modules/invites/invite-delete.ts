import { Invite } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onInviteDelete(client: LoggerClient, invite: Invite): Promise<void> {
  if (!invite.guild) return;

  await client.logger.log({
    guildId: invite.guild.id,
    eventType: 'invite_delete',
    category: 'invites',
    channelId: invite.channel?.id,
    data: {
      inviteDelete: {
        code: invite.code,
        channel: invite.channel ? { id: invite.channel.id, name: invite.channel.name, mention: `<#${invite.channel.id}>` } : null,
        uses: invite.uses,
      },
    },
  });
}
