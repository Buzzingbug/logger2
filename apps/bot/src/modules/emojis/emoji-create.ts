import { GuildEmoji } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onEmojiCreate(client: LoggerClient, emoji: GuildEmoji): Promise<void> {
  await client.logger.log({
    guildId: emoji.guild.id,
    eventType: 'emoji_create',
    category: 'emojis',
    data: {
      emojiCreate: {
        name: emoji.name || 'unknown',
        id: emoji.id,
        url: emoji.url,
      },
    },
  });
}
