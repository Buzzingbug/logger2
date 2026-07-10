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
  memberRoleAdd?: {
    user: LogUser;
    role: LogRole;
  };
  memberRoleRemove?: {
    user: LogUser;
    role: LogRole;
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
