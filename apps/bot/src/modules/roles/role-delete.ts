import { Role } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';

export async function onRoleDelete(client: LoggerClient, role: Role): Promise<void> {
  await client.logger.log({
    guildId: role.guild.id,
    eventType: 'role_delete',
    category: 'roles',
    data: {
      roleDelete: {
        role: {
          id: role.id,
          name: role.name,
          color: role.hexColor,
          mention: role.toString(),
        },
      },
    },
  });
}