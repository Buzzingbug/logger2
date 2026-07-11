import { Events } from 'discord.js';
import type { LoggerClient } from '../core/client.js';
import { logger } from '@logger/utils';
import { onMessageDelete } from '../modules/messages/message-delete.js';
import { onMessageUpdate } from '../modules/messages/message-edit.js';
import { onMessageDeleteBulk } from '../modules/messages/message-bulk-delete.js';
import { onMessageReactionAdd } from '../modules/messages/reaction-add.js';
import { onMessageReactionRemove } from '../modules/messages/reaction-remove.js';

import { onMemberJoin } from '../modules/members/member-join.js';
import { onMemberLeave } from '../modules/members/member-leave.js';
import { onMemberUpdate } from '../modules/members/member-update.js';

import { onVoiceStateUpdate } from '../modules/voice/voice-state.js';

import { onChannelCreate } from '../modules/channels/channel-create.js';
import { onChannelDelete } from '../modules/channels/channel-delete.js';
import { onChannelUpdate } from '../modules/channels/channel-update.js';

import { onRoleCreate } from '../modules/roles/role-create.js';
import { onRoleDelete } from '../modules/roles/role-delete.js';
import { onRoleUpdate } from '../modules/roles/role-update.js';

import { onGuildUpdate } from '../modules/server/guild-update.js';

import { onGuildBanAdd } from '../modules/moderation/ban.js';
import { onGuildBanRemove } from '../modules/moderation/unban.js';
import { onGuildMemberRemove } from '../modules/moderation/kick.js';

import { onInviteCreate } from '../modules/invites/invite-create.js';
import { onInviteDelete } from '../modules/invites/invite-delete.js';

import { onEmojiCreate } from '../modules/emojis/emoji-create.js';
import { onEmojiDelete } from '../modules/emojis/emoji-delete.js';
import { onEmojiUpdate } from '../modules/emojis/emoji-update.js';

import { onThreadCreate } from '../modules/threads/thread-create.js';
import { onThreadDelete } from '../modules/threads/thread-delete.js';
import { onThreadUpdate } from '../modules/threads/thread-update.js';

import { onWebhookUpdate } from '../modules/webhooks/webhook-update.js';

import { onGuildScheduledEventCreate } from '../modules/scheduled/event-create.js';
import { onGuildScheduledEventDelete } from '../modules/scheduled/event-delete.js';
import { onGuildScheduledEventUpdate } from '../modules/scheduled/event-update.js';

export function registerEvents(client: LoggerClient): void {
  logger.info('Registering event handlers...');

  client.on(Events.MessageDelete, (message) => onMessageDelete(client, message).catch(logger.error));
  client.on(Events.MessageUpdate, (oldMsg, newMsg) => onMessageUpdate(client, oldMsg, newMsg).catch(logger.error));
  client.on(Events.MessageDeleteBulk, (messages, channel) => onMessageDeleteBulk(client, messages, channel).catch(logger.error));
  client.on(Events.MessageReactionAdd, (reaction, user) => onMessageReactionAdd(client, reaction, user).catch(logger.error));
  client.on(Events.MessageReactionRemove, (reaction, user) => onMessageReactionRemove(client, reaction, user).catch(logger.error));

  client.on(Events.GuildMemberAdd, (member) => onMemberJoin(client, member).catch(logger.error));
  client.on(Events.GuildMemberRemove, (member) => onMemberLeave(client, member).catch(logger.error));
  client.on(Events.GuildMemberUpdate, (oldMember, newMember) => onMemberUpdate(client, oldMember, newMember).catch(logger.error));

  client.on(Events.VoiceStateUpdate, (oldState, newState) => onVoiceStateUpdate(client, oldState, newState).catch(logger.error));

  client.on(Events.ChannelCreate, (channel) => onChannelCreate(client, channel).catch(logger.error));
  client.on(Events.ChannelDelete, (channel) => onChannelDelete(client, channel).catch(logger.error));
  client.on(Events.ChannelUpdate, (oldChannel, newChannel) => onChannelUpdate(client, oldChannel, newChannel).catch(logger.error));

  client.on(Events.GuildRoleCreate, (role) => onRoleCreate(client, role).catch(logger.error));
  client.on(Events.GuildRoleDelete, (role) => onRoleDelete(client, role).catch(logger.error));
  client.on(Events.GuildRoleUpdate, (oldRole, newRole) => onRoleUpdate(client, oldRole, newRole).catch(logger.error));

  client.on(Events.GuildUpdate, (oldGuild, newGuild) => onGuildUpdate(client, oldGuild, newGuild).catch(logger.error));

  client.on(Events.GuildBanAdd, (ban) => onGuildBanAdd(client, ban).catch(logger.error));
  client.on(Events.GuildBanRemove, (ban) => onGuildBanRemove(client, ban).catch(logger.error));
  client.on(Events.GuildMemberRemove, (member) => onGuildMemberRemove(client, member).catch(logger.error));

  client.on(Events.InviteCreate, (invite) => onInviteCreate(client, invite).catch(logger.error));
  client.on(Events.InviteDelete, (invite) => onInviteDelete(client, invite).catch(logger.error));

  client.on(Events.GuildEmojiCreate, (emoji) => onEmojiCreate(client, emoji).catch(logger.error));
  client.on(Events.GuildEmojiDelete, (emoji) => onEmojiDelete(client, emoji).catch(logger.error));
  client.on(Events.GuildEmojiUpdate, (oldEmoji, newEmoji) => onEmojiUpdate(client, oldEmoji, newEmoji).catch(logger.error));

  client.on(Events.ThreadCreate, (thread) => onThreadCreate(client, thread).catch(logger.error));
  client.on(Events.ThreadDelete, (thread) => onThreadDelete(client, thread).catch(logger.error));
  client.on(Events.ThreadUpdate, (oldThread, newThread) => onThreadUpdate(client, oldThread, newThread).catch(logger.error));

  client.on(Events.WebhooksUpdate, (channel) => onWebhookUpdate(client, channel).catch(logger.error));

  client.on(Events.GuildScheduledEventCreate, (event) => onGuildScheduledEventCreate(client, event).catch(logger.error));
  client.on(Events.GuildScheduledEventDelete, (event) => onGuildScheduledEventDelete(client, event).catch(logger.error));
  client.on(Events.GuildScheduledEventUpdate, (oldEvent, newEvent) => onGuildScheduledEventUpdate(client, oldEvent, newEvent).catch(logger.error));

  logger.info('Event handlers registered');
}