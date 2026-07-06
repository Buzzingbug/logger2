import { GuildEmoji } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onEmojiUpdate(
  client: LoggerClient,
  oldEmoji: GuildEmoji,
  newEmoji: GuildEmoji,
): Promise<void> {
  const changes: Array<{ field: string; old: string; new: string }> = [];

  if (oldEmoji.name !== newEmoji.name) {
    changes.push({ field: 'Name', old: oldEmoji.name || '', new: newEmoji.name || '' });
  }

  if (changes.length === 0) return;

  await client.logger.log({
    guildId: newEmoji.guild.id,
    eventType: 'emoji_update',
    category: 'emojis',
    data: {
      emojiUpdate: {
        name: newEmoji.name || 'unknown',
        id: newEmoji.id,
        changes,
      },
    },
  });
}
