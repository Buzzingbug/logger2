export interface LogEventData {
  // Message events
  messageDelete?: {
    content: string;
    author: LogUser;
    channel: LogChannel;
    attachments: string[];
    embeds: unknown[];
  };
  messageEdit?: {
    oldContent: string;
    newContent: string;
    author: LogUser;
    channel: LogChannel;
    diff: string;
  };
  messageDeleteBulk?: {
    count: number;
    channel: LogChannel;
    messages: Array<{ id: string; content: string; author: LogUser }>;
  };
  messageReactionAdd?: {
    user: LogUser;
    emoji: string;
    messageContent: string;
  };
  messageReactionRemove?: {
    user: LogUser;
    emoji: string;
  };
  messagePin?: {
    user: LogUser;
    messageContent: string;
  };
  messageUnpin?: {
    user: LogUser;
    messageContent: string;
  };

  // Member events
  memberJoin?: {
    user: LogUser;
    accountCreated: string;
    memberCount: number;
  };
  memberLeave?: {
    user: LogUser;
    memberCount: number;
  };
  memberNicknameUpdate?: {
    user: LogUser;
    oldNickname: string | null;
    newNickname: string | null;
  };
  memberAvatarUpdate?: {
    user: LogUser;
    oldAvatar: string | null;
    newAvatar: string | null;
  };
  memberRoleAdd?: {
    user: LogUser;
    role: LogRole;
  };
  memberRoleRemove?: {
    user: LogUser;
    role: LogRole;
  };
  memberPrune?: {
    count: number;
  };

  // Voice events
  voiceJoin?: {
    user: LogUser;
    channel: LogChannel;
    memberCount: number;
  };
  voiceLeave?: {
    user: LogUser;
    channel: LogChannel;
    memberCount: number;
  };
  voiceMove?: {
    user: LogUser;
    oldChannel: LogChannel;
    newChannel: LogChannel;
  };
  voiceDeafen?: {
    user: LogUser;
    channel?: LogChannel;
  };
  voiceUndeafen?: {
    user: LogUser;
    channel?: LogChannel;
  };
  voiceMute?: {
    user: LogUser;
    channel?: LogChannel;
  };
  voiceUnmute?: {
    user: LogUser;
    channel?: LogChannel;
  };
  voiceStageStart?: {
    user: LogUser;
    channel: LogChannel;
  };
  voiceStageEnd?: {
    user: LogUser;
    channel: LogChannel;
  };
  voiceStageUpdate?: {
    user: LogUser;
    channel: LogChannel;
    changes: VoiceStageChange[];
  };

  // Channel events
  channelCreate?: {
    channel: LogChannel;
  };
  channelDelete?: {
    channel: LogChannel;
  };
  channelUpdate?: {
    oldChannel: LogChannel;
    newChannel: LogChannel;
    changes: ChannelChange[];
  };
  channelPermissionUpdate?: {
    channel: LogChannel;
    changes: ChannelPermissionChange[];
  };

  // Role events
  roleCreate?: {
    role: LogRole;
  };
  roleDelete?: {
    role: LogRole;
  };
  roleUpdate?: {
    oldRole: LogRole;
    newRole: LogRole;
    changes: RoleChange[];
  };

  // Server events
  serverUpdate?: {
    oldName: string;
    newName: string;
    oldIcon: string | null;
    newIcon: string | null;
    changes: ServerChange[];
  };
  serverBoostStart?: {
    user: LogUser;
    level: number;
  };
  serverBoostEnd?: {
    user: LogUser;
    level: number;
  };

  // Moderation events
  modBan?: {
    user: LogUser;
    moderator: LogUser;
    reason: string | null;
  };
  modUnban?: {
    user: LogUser;
    moderator: LogUser;
    reason: string | null;
  };
  modKick?: {
    user: LogUser;
    moderator: LogUser;
    reason: string | null;
  };
  modTimeout?: {
    user: LogUser;
    moderator: LogUser;
    reason: string | null;
    duration: string;
  };
  modTimeoutRemove?: {
    user: LogUser;
    moderator: LogUser;
  };

  // Invite events
  inviteCreate?: {
    code: string;
    inviter: LogUser | null;
    channel: LogChannel | null;
    uses: number;
    maxUses: number;
    maxAge: number;
    temporary: boolean;
  };
  inviteDelete?: {
    code: string;
    channel: LogChannel | null;
    uses: number;
  };

  // Emoji events
  emojiCreate?: {
    name: string;
    id: string;
    url: string;
  };
  emojiDelete?: {
    name: string;
    id: string;
  };
  emojiUpdate?: {
    name: string;
    id: string;
    changes: EmojiChange[];
  };

  // Thread events
  threadCreate?: {
    name: string;
    id: string;
    parent: LogChannel | null;
    autoArchiveDuration: number;
  };
  threadDelete?: {
    name: string;
    id: string;
    parent: LogChannel | null;
  };
  threadUpdate?: {
    name: string;
    id: string;
    changes: ThreadChange[];
  };

  // Webhook events
  webhookUpdate?: {
    channel: LogChannel;
  };

  // Scheduled events
  scheduledEventCreate?: {
    name: string;
    id: string;
    channel: LogChannel | null;
    startTime: string | null;
    endTime: string | null;
    status: number;
  };
  scheduledEventDelete?: {
    name: string;
    id: string;
  };
  scheduledEventUpdate?: {
    name: string;
    id: string;
    changes: ScheduledEventChange[];
  };

  // Poll events
  pollCreate?: {
    question: string;
    channel: LogChannel;
  };
  pollEnd?: {
    question: string;
    channel: LogChannel;
  };
  pollVoteAdd?: {
    user: LogUser;
    answerId: number;
    channel: LogChannel;
  };
  pollVoteRemove?: {
    user: LogUser;
    answerId: number;
    channel: LogChannel;
  };

  // Automod events
  automodAction?: {
    ruleName: string;
    user: LogUser;
    channel: LogChannel;
    action: string;
  };
}

export interface VoiceStageChange {
  field: string;
  old: string;
  new: string;
}

export interface ChannelPermissionChange {
  type: 'role' | 'member';
  id: string;
  allow: string[];
  deny: string[];
}

export interface EmojiChange {
  field: string;
  old: string;
  new: string;
}

export interface ThreadChange {
  field: string;
  old: string;
  new: string;
}

export interface ScheduledEventChange {
  field: string;
  old: string;
  new: string;
}

export interface LogUser {
  id: string;
  tag: string;
  avatarUrl: string | null;
  isBot: boolean;
}

export interface LogChannel {
  id: string;
  name: string;
  type: string;
  mention: string;
}

export interface LogRole {
  id: string;
  name: string;
  color: string;
  mention: string;
}

export interface LogGuild {
  id: string;
  name: string;
  iconUrl: string | null;
}

export interface ChannelChange {
  field: string;
  old: string;
  new: string;
}

export interface RoleChange {
  field: string;
  old: string;
  new: string;
}

export interface ServerChange {
  field: string;
  old: string;
  new: string;
}

export interface LogEventInput {
  guildId: string;
  eventType: string;
  category: string;
  channelId?: string;
  userId?: string;
  messageId?: string;
  data: LogEventData;
  embedColor?: string;
  embedTitle?: string;
}

export interface GuildConfig {
  guildId: string;
  name: string;
  iconUrl: string | null;
  logEnabled: boolean;
  logChannelId: string | null;
  logMessages: boolean;
  logMembers: boolean;
  logVoice: boolean;
  logChannels: boolean;
  logRoles: boolean;
  logServer: boolean;
  logModeration: boolean;
  logInvites: boolean;
  logEmojis: boolean;
  logThreads: boolean;
  logWebhooks: boolean;
  logScheduled: boolean;
  logPolls: boolean;
  logAutomod: boolean;
  embedColor: string;
  embedFooter: string | null;
  showAvatars: boolean;
  retentionDays: number;
  ignoredChannels: string[];
  ignoredRoles: string[];
  ignoredUsers: string[];
}

export interface LogFilter {
  id: string;
  name: string;
  eventTypes: string[];
  userIds: string[];
  channelIds: string[];
  searchQuery: string | null;
}

export interface DailyStatsData {
  totalEvents: number;
  messageEvents: number;
  memberEvents: number;
  voiceEvents: number;
  modEvents: number;
  uniqueUsers: number;
  uniqueChannels: number;
}