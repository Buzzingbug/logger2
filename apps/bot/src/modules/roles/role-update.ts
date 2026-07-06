import { Role } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import type { RoleChange } from '@logger/types';

export async function onRoleUpdate(
  client: LoggerClient,
  oldRole: Role,
  newRole: Role,
): Promise<void> {
  const changes: RoleChange[] = [];

  if (oldRole.name !== newRole.name) {
    changes.push({ field: 'Name', old: oldRole.name, new: newRole.name });
  }

  if (oldRole.color !== newRole.color) {
    changes.push({ field: 'Color', old: oldRole.hexColor, new: newRole.hexColor });
  }

  if (oldRole.hoist !== newRole.hoist) {
    changes.push({ field: 'Hoist', old: String(oldRole.hoist), new: String(newRole.hoist) });
  }

  if (oldRole.mentionable !== newRole.mentionable) {
    changes.push({ field: 'Mentionable', old: String(oldRole.mentionable), new: String(newRole.mentionable) });
  }

  if (changes.length === 0) return;

  await client.logger.log({
    guildId: newRole.guild.id,
    eventType: 'role_update',
    category: 'roles',
    data: {
      roleUpdate: {
        oldRole: { id: oldRole.id, name: oldRole.name, color: oldRole.hexColor, mention: oldRole.toString() },
        newRole: { id: newRole.id, name: newRole.name, color: newRole.hexColor, mention: newRole.toString() },
        changes,
      },
    },
  });
}
