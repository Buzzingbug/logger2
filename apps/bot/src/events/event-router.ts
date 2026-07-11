import { Events } from 'discord.js';
import type { LoggerClient } from '../core/client.js';
import { logger } from '@logger/utils';
import { onMessageDelete } from '../modules/messages/message-delete.js';
import { onMessageUpdate } from '../modules/messages/message-edit.js';
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

type AnyFunc = (...args: unknown[]) => void;

export function registerEvents(client: LoggerClient): void {
  logger.info('Registering event handlers...');

  // Message events
  client.on(Events.MessageDelete, onMessageDelete as AnyFunc);
  client.on(Events.MessageUpdate, onMessageUpdate as AnyFunc);
  client.on(Events.MessageReactionAdd, onMessageReactionAdd as AnyFunc);
  client.on(Events.MessageReactionRemove, onMessageReactionRemove as AnyFunc);

  // Member events
  client.on(Events.GuildMemberAdd, onMemberJoin as AnyFunc);
  client.on(Events.GuildMemberRemove, onMemberLeave as AnyFunc);
  client.on(Events.GuildMemberUpdate, onMemberUpdate as AnyFunc);

  // Voice events
  client.on(Events.VoiceStateUpdate, onVoiceStateUpdate as AnyFunc);

  // Channel events
  client.on(Events.ChannelCreate, onChannelCreate as AnyFunc);
  client.on(Events.ChannelDelete, onChannelDelete as AnyFunc);
  client.on(Events.ChannelUpdate, onChannelUpdate as AnyFunc);

  // Role events
  client.on(Events.GuildRoleCreate, onRoleCreate as AnyFunc);
  client.on(Events.GuildRoleDelete, onRoleDelete as AnyFunc);
  client.on(Events.GuildRoleUpdate, onRoleUpdate as AnyFunc);

  // Server events
  client.on(Events.GuildUpdate, onGuildUpdate as AnyFunc);

  // Moderation events
  client.on(Events.GuildBanAdd, onGuildBanAdd as AnyFunc);
  client.on(Events.GuildBanRemove, onGuildBanRemove as AnyFunc);
  client.on(Events.GuildMemberRemove, onGuildMemberRemove as AnyFunc);

  // Invite events
  client.on(Events.InviteCreate, onInviteCreate as AnyFunc);
  client.on(Events.InviteDelete, onInviteDelete as AnyFunc);

  // Emoji events
  client.on(Events.GuildEmojiCreate, onEmojiCreate as AnyFunc);
  client.on(Events.GuildEmojiDelete, onEmojiDelete as AnyFunc);
  client.on(Events.GuildEmojiUpdate, onEmojiUpdate as AnyFunc);

  // Thread events
  client.on(Events.ThreadCreate, onThreadCreate as AnyFunc);
  client.on(Events.ThreadDelete, onThreadDelete as AnyFunc);
  client.on(Events.ThreadUpdate, onThreadUpdate as AnyFunc);

  // Webhook events
  client.on(Events.WebhooksUpdate, onWebhookUpdate as AnyFunc);

  // Scheduled event events
  client.on(Events.GuildScheduledEventCreate, onGuildScheduledEventCreate as AnyFunc);
  client.on(Events.GuildScheduledEventDelete, onGuildScheduledEventDelete as AnyFunc);
  client.on(Events.GuildScheduledEventUpdate, onGuildScheduledEventUpdate as AnyFunc);

  logger.info('Event handlers registered');
}