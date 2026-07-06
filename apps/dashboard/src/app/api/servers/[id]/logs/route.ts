import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@logger/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 50;
  const category = searchParams.get('category');
  const userId = searchParams.get('userId');
  const search = searchParams.get('search');

  const where: any = { guildId: id };

  if (category && category !== 'all') {
    where.category = category;
  }

  if (userId) {
    where.userId = userId;
  }

  if (search) {
    where.OR = [
      { eventType: { contains: search, mode: 'insensitive' } },
      { data: { path: ['$'], string_contains: search } },
    ];
  }

  const [events, total] = await Promise.all([
    prisma.logEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.logEvent.count({ where }),
  ]);

  return NextResponse.json({
    events,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
