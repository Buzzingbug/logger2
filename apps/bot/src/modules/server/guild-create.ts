import type { Guild } from 'discord.js';
import { prisma } from '@logger/db';
import { logger } from '@logger/utils';

export async function onGuildCreate(guild: Guild) {
  try {
    await prisma.guild.upsert({
      where: { guildId: guild.id },
      update: {
        name: guild.name,
        iconUrl: guild.iconURL(),
      },
      create: {
        guildId: guild.id,
        name: guild.name,
        iconUrl: guild.iconURL(),
      },
    });
    logger.info({ guildId: guild.id, name: guild.name }, 'Joined new guild and registered to database');
  } catch (error) {
    logger.error({ error, guildId: guild.id }, 'Failed to register guild to database on join');
  }
}
