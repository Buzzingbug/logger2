import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@logger/db';

export async function GET(request: NextRequest) {
  const guilds = await prisma.guild.findMany({
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(guilds);
}
