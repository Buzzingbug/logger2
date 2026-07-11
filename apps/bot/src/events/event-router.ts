import { Events, Message, MessageReaction, GuildMember, GuildChannel, TextChannel, VoiceState, VoiceChannel, Role, Invite, GuildEmoji, ThreadChannel, GuildBan, GuildScheduledEvent, Webhook } from 'discord.js';
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

  client.on(Events.MessageDelete, (message: Message) => onMessageDelete(client, message).catch(logger.error));
  client.on(Events.MessageUpdate, (oldMsg: Message, newMsg: Message) => onMessageUpdate(client, oldMsg, newMsg).catch(logger.error));
  client.on(Events.MessageDeleteBulk, (messages, channel: TextChannel) => onMessageDeleteBulk(client, messages, channel).catch(logger.error));
  client.on(Events.MessageReactionAdd, (reaction: MessageReaction, user) => onMessageReactionAdd(client, reaction, user).catch(logger.error));
  client.on(Events.MessageReactionRemove, (reaction: MessageReaction, user) => onMessageReactionRemove(client, reaction, user).catch(logger.error));

  client.on(Events.GuildMemberAdd, (member: GuildMember) => onMemberJoin(client, member).catch(logger.error));
  client.on(Events.GuildMemberRemove, (member: GuildMember) => onMemberLeave(client, member).catch(logger.error));
  client.on(Events.GuildMemberUpdate, (oldMember: GuildMember, newMember: GuildMember) => onMemberUpdate(client, oldMember, newMember).catch(logger.error));

  client.on(Events.VoiceStateUpdate, (oldState: VoiceState, newState: VoiceState) => onVoiceStateUpdate(client, oldState, newState).catch(logger.error));

  client.on(Events.ChannelCreate, (channel: GuildChannel) => onChannelCreate(client, channel).catch(logger.error));
  client.on(Events.ChannelDelete, (channel: GuildChannel) => onChannelDelete(client, channel).catch(logger.error));
  client.on(Events.ChannelUpdate, (oldChannel: GuildChannel, newChannel: GuildChannel) => onChannelUpdate(client, oldChannel, newChannel).catch(logger.error));

  client.on(Events.GuildRoleCreate, (role: Role) => onRoleCreate(client, role).catch(logger.error));
  client.on(Events.GuildRoleDelete, (role: Role) => onRoleDelete(client, role).catch(logger.error));
  client.on(Events.GuildRoleUpdate, (oldRole: Role, newRole: Role) => onRoleUpdate(client, oldRole, newRole).catch(logger.error));

  client.on(Events.GuildUpdate, (oldGuild, newGuild) => onGuildUpdate(client, oldGuild, newGuild).catch(logger.error));

  client.on(Events.GuildBanAdd, (ban: GuildBan) => onGuildBanAdd(client, ban).catch(logger.error));
  client.on(Events.GuildBanRemove, (ban: GuildBan) => onGuildBanRemove(client, ban).catch(logger.error));
  client.on(Events.GuildMemberRemove, (member: GuildMember) => onGuildMemberRemove(client, member).catch(logger.error));

  client.on(Events.InviteCreate, (invite: Invite) => onInviteCreate(client, invite).catch(logger.error));
  client.on(Events.InviteDelete, (invite: Invite) => onInviteDelete(client, invite).catch(logger.error));

  client.on(Events.GuildEmojiCreate, (emoji: GuildEmoji) => onEmojiCreate(client, emoji).catch(logger.error));
  client.on(Events.GuildEmojiDelete, (emoji: GuildEmoji) => onEmojiDelete(client, emoji).catch(logger.error));
  client.on(Events.GuildEmojiUpdate, (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => onEmojiUpdate(client, oldEmoji, newEmoji).catch(logger.error));

  client.on(Events.ThreadCreate, (thread: ThreadChannel) => onThreadCreate(client, thread).catch(logger.error));
  client.on(Events.ThreadDelete, (thread: ThreadChannel) => onThreadDelete(client, thread).catch(logger.error));
  client.on(Events.ThreadUpdate, (oldThread: ThreadChannel, newThread: ThreadChannel) => onThreadUpdate(client, oldThread, newThread).catch(logger.error));

  client.on(Events.WebhooksUpdate, (channel: TextChannel) => onWebhookUpdate(client, channel).catch(logger.error));

  client.on(Events.GuildScheduledEventCreate, (event: GuildScheduledEvent) => onGuildScheduledEventCreate(client, event).catch(logger.error));
  client.on(Events.GuildScheduledEventDelete, (event: GuildScheduledEvent) => onGuildScheduledEventDelete(client, event).catch(logger.error));
  client.on(Events.GuildScheduledEventUpdate, (oldEvent: GuildScheduledEvent, newEvent: GuildScheduledEvent) => onGuildScheduledEventUpdate(client, oldEvent, newEvent).catch(logger.error));

  logger.info('Event handlers registered');
}