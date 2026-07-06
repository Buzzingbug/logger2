import { prisma } from '@logger/db';
import { redis } from '@logger/utils';

export { prisma, redis };

export async function getUserGuilds(userId: string) {
  const cached = await redis.get(`user-guilds:${userId}`);
  if (cached) return JSON.parse(cached);

  // Fetch from Discord API via session
  return null;
}

export async function getGuildConfig(guildId: string) {
  const cached = await redis.get(`guild:${guildId}`);
  if (cached) return JSON.parse(cached);

  const guild = await prisma.guild.findUnique({
    where: { guildId },
  });

  if (guild) {
    await redis.setex(`guild:${guildId}`, 300, JSON.stringify(guild));
  }

  return guild;
}

export async function updateGuildConfig(guildId: string, data: any) {
  const guild = await prisma.guild.upsert({
    where: { guildId },
    update: data,
    create: {
      guildId,
      name: data.name || 'Unknown Server',
      ...data,
    },
  });

  await redis.del(`guild:${guildId}`);
  return guild;
}

export async function getLogEvents(guildId: string, options?: {
  category?: string;
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = options?.page || 1;
  const limit = options?.limit || 50;
  const skip = (page - 1) * limit;

  const where: any = { guildId };

  if (options?.category && options.category !== 'all') {
    where.category = options.category;
  }

  if (options?.userId) {
    where.userId = options.userId;
  }

  if (options?.search) {
    where.OR = [
      { eventType: { contains: options.search, mode: 'insensitive' } },
      { data: { path: ['$'], string_contains: options.search } },
    ];
  }

  const [events, total] = await Promise.all([
    prisma.logEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.logEvent.count({ where }),
  ]);

  return {
    events,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getDailyStats(guildId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return prisma.dailyStats.findMany({
    where: {
      guildId,
      date: { gte: startDate },
    },
    orderBy: { date: 'asc' },
  });
}
