import { Client, Collection, GatewayIntentBits, Partials, ActivityType } from 'discord.js';
import { logger } from '@logger/utils';
import { env } from '@logger/config';
import { LoggerService } from '../services/logger.service.js';
import { CacheService } from '../services/cache.service.js';
import { EventRouter } from '../events/event-router.js';

export interface LoggerClient extends Client {
  logger: LoggerService;
  cache: CacheService;
  eventRouter: EventRouter;
  startTime: number;
}

export function createClient(shardId: number, shardCount: number): LoggerClient {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.AutoModerationConfiguration,
      GatewayIntentBits.AutoModerationExecution,
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.GuildMember,
      Partials.User,
      Partials.GuildScheduledEvent,
    ],
    shards: [shardId, shardCount],
    presence: {
      activities: [
        {
          name: 'logs | /help',
          type: ActivityType.Watching,
        },
      ],
      status: 'online',
    },
  }) as LoggerClient;

  client.logger = new LoggerService(client);
  client.cache = new CacheService();
  client.eventRouter = new EventRouter(client);
  client.startTime = Date.now();

  return client;
}
