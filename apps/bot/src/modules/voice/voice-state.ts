import { VoiceState } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser, formatChannel } from '@logger/utils';

export async function onVoiceStateUpdate(
  client: LoggerClient,
  oldState: VoiceState,
  newState: VoiceState,
): Promise<void> {
  const guild = newState.guild || oldState.guild;
  if (!guild) return;

  const member = newState.member || oldState.member;
  if (!member || member.user.bot) return;

  const userId = member.id;
  const guildId = guild.id;

  if (!oldState.channel && newState.channel) {
    await client.logger.log({
      guildId,
      eventType: 'voice_join',
      category: 'voice',
      channelId: newState.channel.id,
      userId,
      data: {
        voiceJoin: {
          user: formatUser(member.user),
          channel: formatChannel(newState.channel),
          memberCount: newState.channel.members.size,
        },
      },
    });
    return;
  }

  if (oldState.channel && !newState.channel) {
    await client.logger.log({
      guildId,
      eventType: 'voice_leave',
      category: 'voice',
      channelId: oldState.channel.id,
      userId,
      data: {
        voiceLeave: {
          user: formatUser(member.user),
          channel: formatChannel(oldState.channel),
          memberCount: oldState.channel.members.size,
        },
      },
    });
    return;
  }

  if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
    await client.logger.log({
      guildId,
      eventType: 'voice_move',
      category: 'voice',
      channelId: newState.channel.id,
      userId,
      data: {
        voiceMove: {
          user: formatUser(member.user),
          oldChannel: formatChannel(oldState.channel),
          newChannel: formatChannel(newState.channel),
        },
      },
    });
    return;
  }

  if (oldState.deaf !== newState.deaf) {
    const eventType = newState.deaf ? 'voice_deafen' : 'voice_undeafen';
    await client.logger.log({
      guildId,
      eventType,
      category: 'voice',
      channelId: newState.channel?.id,
      userId,
      data: {
        [eventType]: {
          user: formatUser(member.user),
          channel: newState.channel ? formatChannel(newState.channel) : undefined,
        },
      },
    });
  }

  if (oldState.mute !== newState.mute) {
    const eventType = newState.mute ? 'voice_mute' : 'voice_unmute';
    await client.logger.log({
      guildId,
      eventType,
      category: 'voice',
      channelId: newState.channel?.id,
      userId,
      data: {
        [eventType]: {
          user: formatUser(member.user),
          channel: newState.channel ? formatChannel(newState.channel) : undefined,
        },
      },
    });
  }
}