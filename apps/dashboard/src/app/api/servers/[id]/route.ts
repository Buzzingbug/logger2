import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@logger/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const guild = await prisma.guild.findUnique({
    where: { guildId: id },
  });

  if (!guild) {
    return NextResponse.json({ error: 'Guild not found' }, { status: 404 });
  }

  return NextResponse.json(guild);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const guild = await prisma.guild.upsert({
    where: { guildId: id },
    update: body,
    create: {
      guildId: id,
      name: body.name || 'Unknown Server',
      ...body,
    },
  });

  return NextResponse.json(guild);
}
