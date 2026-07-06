import { GuildEmoji } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onEmojiDelete(client: LoggerClient, emoji: GuildEmoji): Promise<void> {
  await client.logger.log({
    guildId: emoji.guild.id,
    eventType: 'emoji_delete',
    category: 'emojis',
    data: {
      emojiDelete: {
        name: emoji.name || 'unknown',
        id: emoji.id,
      },
    },
  });
}
