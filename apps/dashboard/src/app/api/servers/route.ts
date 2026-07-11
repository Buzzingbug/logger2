import { NextResponse } from 'next/server';
import { prisma } from '@logger/db';

export async function GET() {
  const guilds = await prisma.guild.findMany({
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(guilds);
}
