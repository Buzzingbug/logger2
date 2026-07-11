import { EmbedBuilder, TextChannel } from 'discord.js';
import { prisma } from '@logger/db';
import { logger as pinoLogger } from '@logger/utils';
import type { LogEventInput, GuildConfig } from '@logger/types';

export class LoggerService {
  private logger = pinoLogger.child({ service: 'LoggerService' });

  constructor(private client: import('../core/client.js').LoggerClient) {}

  async log(event: LogEventInput): Promise<void> {
    try {
      const guildConfig = await this.getGuildConfig(event.guildId);
      if (!guildConfig || !guildConfig.logEnabled) return;

      if (!this.isEventEnabled(guildConfig, event.category)) return;

      if (this.isIgnored(guildConfig, event.channelId, event.userId)) return;

      await this.storeEvent(event);
      await this.sendLog(event, guildConfig);
      await this.updateStats(event.guildId, event.category);
    } catch (error) {
      this.logger.error({ error, event }, 'Failed to log event');
    }
  }

  async getGuildConfig(guildId: string): Promise<GuildConfig | null> {
    const cached = await this.client.cache.get(`guild:${guildId}`);
    if (cached) return JSON.parse(cached) as GuildConfig;

    const guild = await prisma.guild.findUnique({ where: { guildId } });
    if (!guild) return null;

    const config: GuildConfig = {
      guildId: guild.guildId,
      name: guild.name,
      iconUrl: guild.iconUrl,
      logEnabled: guild.logEnabled,
      logChannelId: guild.logChannelId,
      logMessages: guild.logMessages,
      logMembers: guild.logMembers,
      logVoice: guild.logVoice,
      logChannels: guild.logChannels,
      logRoles: guild.logRoles,
      logServer: guild.logServer,
      logModeration: guild.logModeration,
      logInvites: guild.logInvites,
      logEmojis: guild.logEmojis,
      logThreads: guild.logThreads,
      logWebhooks: guild.logWebhooks,
      logScheduled: guild.logScheduled,
      logPolls: guild.logPolls,
      logAutomod: guild.logAutomod,
      embedColor: guild.embedColor,
      embedFooter: guild.embedFooter,
      showAvatars: guild.showAvatars,
      retentionDays: guild.retentionDays,
      ignoredChannels: guild.ignoredChannels,
      ignoredRoles: guild.ignoredRoles,
      ignoredUsers: guild.ignoredUsers,
    };

    await this.client.cache.set(`guild:${guildId}`, JSON.stringify(config), 300);
    return config;
  }

  private isEventEnabled(config: GuildConfig, category: string): boolean {
    const categoryMap: Record<string, boolean> = {
      messages: config.logMessages,
      members: config.logMembers,
      voice: config.logVoice,
      channels: config.logChannels,
      roles: config.logRoles,
      server: config.logServer,
      moderation: config.logModeration,
      invites: config.logInvites,
      emojis: config.logEmojis,
      threads: config.logThreads,
      webhooks: config.logWebhooks,
      scheduled: config.logScheduled,
      polls: config.logPolls,
      automod: config.logAutomod,
    };
    return categoryMap[category] ?? true;
  }

  private isIgnored(
    config: GuildConfig,
    channelId?: string | null,
    userId?: string | null,
  ): boolean {
    if (channelId && config.ignoredChannels.includes(channelId)) return true;
    if (userId && config.ignoredUsers.includes(userId)) return true;
    return false;
  }

  private async storeEvent(event: LogEventInput): Promise<void> {
    await prisma.logEvent.create({
      data: {
        guildId: event.guildId,
        eventType: event.eventType,
        category: event.category,
        channelId: event.channelId,
        userId: event.userId,
        messageId: event.messageId,
        data: event.data as object,
        embedColor: event.embedColor,
        embedTitle: event.embedTitle,
      },
    });
  }

  private async sendLog(event: LogEventInput, config: GuildConfig): Promise<void> {
    if (!config.logChannelId) return;

    const guild = this.client.guilds.cache.get(event.guildId);
    if (!guild) return;

    const channel = guild.channels.cache.get(config.logChannelId) as TextChannel | undefined;
    if (!channel || !channel.isTextBased()) return;

    const embed = this.buildEmbed(event, config);
    if (!embed) return;

    try {
      await channel.send({ embeds: [embed] });
    } catch (error: any) {
      if (error.code === 50013) {
        this.logger.warn({ guildId: event.guildId }, 'Missing permissions to send logs');
      } else if (error.code === 429) {
        this.logger.warn({ guildId: event.guildId }, 'Rate limited, logs may be delayed');
      } else {
        throw error;
      }
    }
  }

  private buildEmbed(event: LogEventInput, config: GuildConfig): EmbedBuilder | null {
    const data = event.data as Record<string, any>;
    const color = event.embedColor
      ? parseInt(event.embedColor.replace('#', ''), 16)
      : parseInt(config.embedColor.replace('#', ''), 16);

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTimestamp();

    if (config.embedFooter) {
      embed.setFooter({ text: config.embedFooter });
    }

    switch (event.eventType) {
      case 'message_delete':
        if (data.messageDelete) {
          const d = data.messageDelete;
          embed
            .setTitle('Message Deleted')
            .setDescription(`Message deleted in ${d.channel.mention}`)
            .addFields(
              { name: 'Author', value: `${d.author.tag}`, inline: true },
              { name: 'Channel', value: d.channel.mention, inline: true },
            );
          if (d.content) {
            embed.addFields({ name: 'Content', value: d.content.slice(0, 1024) });
          }
          if (config.showAvatars && d.author.avatarUrl) {
            embed.setThumbnail(d.author.avatarUrl);
          }
        }
        break;

      case 'message_edit':
        if (data.messageEdit) {
          const d = data.messageEdit;
          embed
            .setTitle('Message Edited')
            .setDescription(`Message edited in ${d.channel.mention}`)
            .addFields(
              { name: 'Author', value: `${d.author.tag}`, inline: true },
              { name: 'Channel', value: d.channel.mention, inline: true },
              { name: 'Old', value: d.oldContent.slice(0, 1024) || '*(empty)*' },
              { name: 'New', value: d.newContent.slice(0, 1024) || '*(empty)*' },
            );
          if (config.showAvatars && d.author.avatarUrl) {
            embed.setThumbnail(d.author.avatarUrl);
          }
        }
        break;

      case 'member_join':
        if (data.memberJoin) {
          const d = data.memberJoin;
          embed
            .setTitle('Member Joined')
            .setDescription(`${d.user.tag} joined the server`)
            .addFields(
              { name: 'User', value: `<@${d.user.id}>`, inline: true },
              { name: 'Member Count', value: `${d.memberCount}`, inline: true },
              { name: 'Account Created', value: d.accountCreated, inline: true },
            );
          if (config.showAvatars && d.user.avatarUrl) {
            embed.setThumbnail(d.user.avatarUrl);
          }
        }
        break;

      case 'member_leave':
        if (data.memberLeave) {
          const d = data.memberLeave;
          embed
            .setTitle('Member Left')
            .setDescription(`${d.user.tag} left the server`)
            .addFields(
              { name: 'User', value: `${d.user.tag}`, inline: true },
              { name: 'Member Count', value: `${d.memberCount}`, inline: true },
            );
          if (config.showAvatars && d.user.avatarUrl) {
            embed.setThumbnail(d.user.avatarUrl);
          }
        }
        break;

      default:
        embed
          .setTitle(event.embedTitle || event.eventType)
          .setDescription(JSON.stringify(data, null, 2).slice(0, 4096));
    }

    return embed;
  }

  private async updateStats(guildId: string, category: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const categoryField: Record<string, string> = {
      messages: 'messageEvents',
      members: 'memberEvents',
      voice: 'voiceEvents',
      moderation: 'modEvents',
    };

    const field = categoryField[category];
    if (!field) return;

    await prisma.dailyStats.upsert({
      where: { guildId_date: { guildId, date: today } },
      create: {
        guildId,
        date: today,
        totalEvents: 1,
        [field]: 1,
      },
      update: {
        totalEvents: { increment: 1 },
        [field]: { increment: 1 },
      },
    });
  }
}