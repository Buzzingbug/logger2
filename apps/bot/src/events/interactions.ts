import { Events, InteractionType, EmbedBuilder } from 'discord.js';
import type { LoggerClient } from '../core/client.js';
import { prisma } from '@logger/db';
import { logger } from '@logger/utils';

export function registerInteractionHandlers(client: LoggerClient): void {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const { commandName } = interaction;

    try {
      switch (commandName) {
        case 'logs':
          await handleLogs(interaction, client);
          break;
        case 'config':
          await handleConfig(interaction, client);
          break;
        case 'help':
          await handleHelp(interaction);
          break;
        case 'stats':
          await handleStats(interaction, client);
          break;
      }
    } catch (error) {
      logger.error({ error, command: commandName }, 'Command error');

      const reply = {
        embeds: [
          new EmbedBuilder()
            .setColor(0xed4245)
            .setDescription('An error occurred while executing this command.'),
        ],
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  });
}

async function handleLogs(interaction: any, client: LoggerClient) {
  await interaction.deferReply({ ephemeral: true });

  const sub = interaction.options.getSubcommand();
  const guildId = interaction.guildId;

  if (sub === 'view') {
    const type = interaction.options.getString('type') || 'all';
    const where: any = { guildId };
    if (type !== 'all') where.category = type;

    const logs = await prisma.logEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (logs.length === 0) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x5865f2)
            .setDescription('No logs found for this filter.'),
        ],
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('Recent Logs')
      .setDescription(
        logs
          .map(
            (log, i) =>
              `**${i + 1}.** \`${log.eventType}\` - <t:${Math.floor(log.createdAt.getTime() / 1000)}:R>`,
          )
          .join('\n'),
      );

    await interaction.editReply({ embeds: [embed] });
  }

  if (sub === 'search') {
    const query = interaction.options.getString('query');
    const logs = await prisma.logEvent.findMany({
      where: {
        guildId,
        data: { path: ['$'], string_contains: query },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`Search Results for "${query}"`)
      .setDescription(
        logs.length > 0
          ? logs
              .map(
                (log, i) =>
                  `**${i + 1}.** \`${log.eventType}\` - <t:${Math.floor(log.createdAt.getTime() / 1000)}:R>`,
              )
              .join('\n')
          : 'No results found.',
      );

    await interaction.editReply({ embeds: [embed] });
  }

  if (sub === 'user') {
    const user = interaction.options.getUser('target');
    const logs = await prisma.logEvent.findMany({
      where: { guildId, userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`Logs for ${user.tag}`)
      .setDescription(
        logs.length > 0
          ? logs
              .map(
                (log, i) =>
                  `**${i + 1}.** \`${log.eventType}\` - <t:${Math.floor(log.createdAt.getTime() / 1000)}:R>`,
              )
              .join('\n')
          : 'No logs found for this user.',
      );

    await interaction.editReply({ embeds: [embed] });
  }
}

async function handleConfig(interaction: any, client: LoggerClient) {
  const dashboardUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle('Logger Dashboard')
        .setDescription(
          `Configure Logger for your server using the web dashboard.\n\n` +
            `**[Open Dashboard](${dashboardUrl}/server/${interaction.guildId}/settings)**`,
        )
        .setFooter({ text: 'You need Manage Server permission to change settings.' }),
    ],
    ephemeral: true,
  });
}

async function handleHelp(interaction: any) {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('Logger Commands')
    .setDescription('Here are all available commands:')
    .addFields(
      {
        name: '/logs view [type]',
        value: 'View recent log entries, optionally filtered by type',
      },
      {
        name: '/logs search <query>',
        value: 'Search through all logs',
      },
      {
        name: '/logs user <target>',
        value: 'Filter logs by a specific user',
      },
      {
        name: '/config',
        value: 'Open the web dashboard to configure logging',
      },
      {
        name: '/stats',
        value: 'View server logging statistics',
      },
      {
        name: '/help',
        value: 'Show this help message',
      },
    )
    .setFooter({ text: 'Logger - Comprehensive Discord Logging' });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleStats(interaction: any, client: LoggerClient) {
  await interaction.deferReply({ ephemeral: true });

  const guildId = interaction.guildId;

  const totalLogs = await prisma.logEvent.count({ where: { guildId } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStats = await prisma.dailyStats.findUnique({
    where: { guildId_date: { guildId, date: today } },
  });

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('Logging Statistics')
    .addFields(
      { name: 'Total Logs', value: `${totalLogs}`, inline: true },
      {
        name: 'Today',
        value: todayStats
          ? `**${todayStats.totalEvents}** events\n` +
            `Messages: ${todayStats.messageEvents}\n` +
            `Members: ${todayStats.memberEvents}\n` +
            `Voice: ${todayStats.voiceEvents}\n` +
            `Moderation: ${todayStats.modEvents}`
          : 'No data yet',
        inline: true,
      },
    );

  await interaction.editReply({ embeds: [embed] });
}
