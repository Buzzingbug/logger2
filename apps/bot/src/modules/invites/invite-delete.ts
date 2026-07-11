import { Invite } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatChannel } from '@logger/utils';

export async function onInviteDelete(client: LoggerClient, invite: Invite): Promise<void> {
  if (!invite.guild) return;

  const channel = invite.channel as any;
  const channelData = channel ? { id: channel.id, name: channel.name, mention: `<#${channel.id}>` } : null;

  await client.logger.log({
    guildId: invite.guild.id,
    eventType: 'invite_delete',
    category: 'invites',
    channelId: invite.channel?.id,
    data: {
      inviteDelete: {
        code: invite.code,
        channel: channelData,
        uses: invite.uses ?? 0,
      },
    },
  });
}