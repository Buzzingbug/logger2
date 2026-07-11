import { GuildMember } from 'discord.js';
import type { LoggerClient } from '../../core/client.js';
import { formatUser } from '@logger/utils';

export async function onMemberUpdate(
  client: LoggerClient,
  oldMember: GuildMember,
  newMember: GuildMember,
): Promise<void> {
  const guildId = newMember.guild.id;

  if (oldMember.nickname !== newMember.nickname) {
    await client.logger.log({
      guildId,
      eventType: 'member_nickname_update',
      category: 'members',
      userId: newMember.id,
      data: {
        memberNicknameUpdate: {
          user: formatUser(newMember.user),
          oldNickname: oldMember.nickname,
          newNickname: newMember.nickname,
        },
      },
    });
  }

  if (oldMember.displayAvatarURL() !== newMember.displayAvatarURL()) {
    await client.logger.log({
      guildId,
      eventType: 'member_avatar_update',
      category: 'members',
      userId: newMember.id,
      data: {
        memberAvatarUpdate: {
          user: formatUser(newMember.user),
          oldAvatar: oldMember.displayAvatarURL(),
          newAvatar: newMember.displayAvatarURL(),
        },
      },
    });
  }

  const oldRoles = new Set(oldMember.roles.cache.keys());
  const newRoles = new Set(newMember.roles.cache.keys());

  const addedRoles = [...newRoles].filter((r) => !oldRoles.has(r));
  const removedRoles = [...oldRoles].filter((r) => !newRoles.has(r));

  for (const roleId of addedRoles) {
    const role = newMember.guild.roles.cache.get(roleId);
    if (!role) continue;

    await client.logger.log({
      guildId,
      eventType: 'member_role_add',
      category: 'members',
      userId: newMember.id,
      data: {
        memberRoleAdd: {
          user: formatUser(newMember.user),
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

  for (const roleId of removedRoles) {
    const role = newMember.guild.roles.cache.get(roleId);
    if (!role) continue;

    await client.logger.log({
      guildId,
      eventType: 'member_role_remove',
      category: 'members',
      userId: newMember.id,
      data: {
        memberRoleRemove: {
          user: formatUser(newMember.user),
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
}