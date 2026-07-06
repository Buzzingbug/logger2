export const BOT_NAME = 'Logger';
export const BOT_VERSION = '1.0.0';

export const LOG_CATEGORIES = {
  MESSAGES: 'messages',
  MEMBERS: 'members',
  VOICE: 'voice',
  CHANNELS: 'channels',
  ROLES: 'roles',
  SERVER: 'server',
  MODERATION: 'moderation',
  INVITES: 'invites',
  EMOJIS: 'emojis',
  THREADS: 'threads',
  WEBHOOKS: 'webhooks',
  SCHEDULED: 'scheduled',
  POLLS: 'polls',
  AUTOMOD: 'automod',
} as const;

export const EVENT_TYPES = {
  // Messages
  MESSAGE_DELETE: 'message_delete',
  MESSAGE_DELETE_BULK: 'message_delete_bulk',
  MESSAGE_EDIT: 'message_edit',
  MESSAGE_PIN: 'message_pin',
  MESSAGE_UNPIN: 'message_unpin',
  MESSAGE_REACTION_ADD: 'message_reaction_add',
  MESSAGE_REACTION_REMOVE: 'message_reaction_remove',

  // Members
  MEMBER_JOIN: 'member_join',
  MEMBER_LEAVE: 'member_leave',
  MEMBER_NICKNAME_UPDATE: 'member_nickname_update',
  MEMBER_AVATAR_UPDATE: 'member_avatar_update',
  MEMBER_ROLE_ADD: 'member_role_add',
  MEMBER_ROLE_REMOVE: 'member_role_remove',
  MEMBER_PRUNE: 'member_prune',

  // Voice
  VOICE_JOIN: 'voice_join',
  VOICE_LEAVE: 'voice_leave',
  VOICE_MOVE: 'voice_move',
  VOICE_DEAFEN: 'voice_deafen',
  VOICE_UNDEAFEN: 'voice_undeafen',
  VOICE_MUTE: 'voice_mute',
  VOICE_UNMUTE: 'voice_unmute',
  VOICE_STAGE_START: 'voice_stage_start',
  VOICE_STAGE_END: 'voice_stage_end',
  VOICE_STAGE_UPDATE: 'voice_stage_update',

  // Channels
  CHANNEL_CREATE: 'channel_create',
  CHANNEL_DELETE: 'channel_delete',
  CHANNEL_UPDATE: 'channel_update',
  CHANNEL_PERMISSION_UPDATE: 'channel_permission_update',

  // Roles
  ROLE_CREATE: 'role_create',
  ROLE_DELETE: 'role_delete',
  ROLE_UPDATE: 'role_update',

  // Server
  SERVER_UPDATE: 'server_update',
  SERVER_ICON_UPDATE: 'server_icon_update',
  SERVER_BOOST_START: 'server_boost_start',
  SERVER_BOOST_END: 'server_boost_end',

  // Moderation
  MOD_BAN: 'mod_ban',
  MOD_UNBAN: 'mod_unban',
  MOD_KICK: 'mod_kick',
  MOD_TIMEOUT: 'mod_timeout',
  MOD_TIMEOUT_REMOVE: 'mod_timeout_remove',

  // Invites
  INVITE_CREATE: 'invite_create',
  INVITE_DELETE: 'invite_delete',

  // Emojis
  EMOJI_CREATE: 'emoji_create',
  EMOJI_DELETE: 'emoji_delete',
  EMOJI_UPDATE: 'emoji_update',

  // Threads
  THREAD_CREATE: 'thread_create',
  THREAD_DELETE: 'thread_delete',
  THREAD_UPDATE: 'thread_update',

  // Webhooks
  WEBHOOK_CREATE: 'webhook_create',
  WEBHOOK_DELETE: 'webhook_delete',
  WEBHOOK_UPDATE: 'webhook_update',

  // Scheduled Events
  SCHEDULED_EVENT_CREATE: 'scheduled_event_create',
  SCHEDULED_EVENT_DELETE: 'scheduled_event_delete',
  SCHEDULED_EVENT_UPDATE: 'scheduled_event_update',

  // Polls
  POLL_CREATE: 'poll_create',
  POLL_END: 'poll_end',
  POLL_VOTE_ADD: 'poll_vote_add',
  POLL_VOTE_REMOVE: 'poll_vote_remove',
} as const;

export const EMBED_COLORS = {
  DEFAULT: 0x5865f2,
  SUCCESS: 0x57f287,
  WARNING: 0xfee75c,
  DANGER: 0xed4245,
  MESSAGE_DELETE: 0xed4245,
  MESSAGE_EDIT: 0xfee75c,
  MEMBER_JOIN: 0x57f287,
  MEMBER_LEAVE: 0xed4245,
  VOICE_JOIN: 0x57f287,
  VOICE_LEAVE: 0xed4245,
  CHANNEL_CREATE: 0x57f287,
  CHANNEL_DELETE: 0xed4245,
  ROLE_CREATE: 0x57f287,
  ROLE_DELETE: 0xed4245,
  MOD_ACTION: 0xed4245,
  SERVER_UPDATE: 0x5865f2,
} as const;

export const MAX_LOG_LENGTH = 4096;
export const MAX_EMBED_FIELDS = 25;
export const RATE_LIMIT_PER_GUILD = 5; // logs per second per guild
