import type { Guild, User, TextChannel, VoiceChannel, StageChannel } from 'discord.js';
import type { LogUser, LogChannel, LogGuild } from '@logger/types';

export function formatUser(user: User): LogUser {
  return {
    id: user.id,
    tag: user.tag,
    avatarUrl: user.displayAvatarURL({ size: 256, extension: 'png' }),
    isBot: user.bot,
  };
}

export function formatChannel(channel: TextChannel | VoiceChannel | StageChannel): LogChannel {
  return {
    id: channel.id,
    name: channel.name,
    type: channel.type.toString(),
    mention: channel.toString(),
  };
}

export function formatGuild(guild: Guild): LogGuild {
  return {
    id: guild.id,
    name: guild.name,
    iconUrl: guild.iconURL({ size: 256, extension: 'png' }),
  };
}

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function diffWords(oldStr: string, newStr: string): string {
  const oldWords = oldStr.split(/\s+/);
  const newWords = newStr.split(/\s+/);

  let result = '';

  for (let i = 0; i < Math.max(oldWords.length, newWords.length); i++) {
    if (i >= oldWords.length) {
      result += `+${newWords[i]} `;
    } else if (i >= newWords.length) {
      result += `-${oldWords[i]} `;
    } else if (oldWords[i] !== newWords[i]) {
      result += `~~${oldWords[i]}~~ → ${newWords[i]} `;
    } else {
      result += `${oldWords[i]} `;
    }
  }

  return result.trim();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
