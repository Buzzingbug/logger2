import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const headers = Object.fromEntries(req.headers.entries());
  return NextResponse.json({ url: req.url, headers });
}
