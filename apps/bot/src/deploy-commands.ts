import { REST, Routes } from 'discord.js';
import { env } from '@logger/config';
import { logger } from '@logger/utils';

const commands = [
  {
    name: 'logs',
    description: 'View recent logs for this server',
    options: [
      {
        type: 1,
        name: 'view',
        description: 'View recent log entries',
        options: [
          {
            type: 3,
            name: 'type',
            description: 'Filter by event type',
            required: false,
            choices: [
              { name: 'Messages', value: 'messages' },
              { name: 'Members', value: 'members' },
              { name: 'Voice', value: 'voice' },
              { name: 'Channels', value: 'channels' },
              { name: 'Roles', value: 'roles' },
              { name: 'Moderation', value: 'moderation' },
              { name: 'All', value: 'all' },
            ],
          },
        ],
      },
      {
        type: 1,
        name: 'search',
        description: 'Search through logs',
        options: [
          {
            type: 3,
            name: 'query',
            description: 'Search query',
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: 'user',
        description: 'Filter logs by a specific user',
        options: [
          {
            type: 6,
            name: 'target',
            description: 'The user to filter by',
            required: true,
          },
        ],
      },
    ],
  },
  {
    name: 'config',
    description: 'Open the Logger dashboard to configure this server',
  },
  {
    name: 'help',
    description: 'Show all available commands',
  },
  {
    name: 'stats',
    description: 'View server logging statistics',
  },
];

const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);

async function deployGlobal() {
  logger.info('Deploying global commands...');

  await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), {
    body: commands,
  });

  logger.info('Global commands deployed');
}

async function deployGuild(guildId: string) {
  logger.info(`Deploying guild commands to ${guildId}...`);

  await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId), {
    body: commands,
  });

  logger.info(`Guild commands deployed to ${guildId}`);
}

const target = process.argv[2];

if (target === 'global') {
  deployGlobal().catch(console.error);
} else if (target) {
  deployGuild(target).catch(console.error);
} else {
  // Default: deploy to dev guild if specified, otherwise global
  if (env.DEV_GUILD_ID) {
    deployGuild(env.DEV_GUILD_ID).catch(console.error);
  } else {
    deployGlobal().catch(console.error);
  }
}
