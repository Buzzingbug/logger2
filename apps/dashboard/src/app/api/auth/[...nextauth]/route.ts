import { handlers } from '@/lib/auth';
import { NextRequest } from 'next/server';

const wrapRequest = (req: NextRequest) => {
  const url = new URL(req.url);
  const baseUrl = process.env.NEXTAUTH_URL || 'https://logger2-production.up.railway.app';
  const newOrigin = new URL(baseUrl).origin;
  
  // Rewrite the request URL to match the real production domain
  // This bypasses both the Railway localhost proxy bug AND the Auth.js v5 beta 25 base path parsing bugs!
  const newUrl = new URL(url.pathname + url.search, newOrigin);
  
  // Copy all headers so we don't lose anything important
  const headers = new Headers(req.headers);
  headers.set('host', new URL(newOrigin).host);
  headers.set('x-forwarded-host', new URL(newOrigin).host);
  headers.set('x-forwarded-proto', 'https');
  
  return new NextRequest(newUrl, {
    method: req.method,
    headers,
    body: req.body,
    referrer: req.referrer,
    referrerPolicy: req.referrerPolicy,
    mode: req.mode,
    credentials: req.credentials,
    cache: req.cache,
    redirect: req.redirect,
    integrity: req.integrity,
  });
};

export const GET = async (req: NextRequest) => {
  try {
    const res = await handlers.GET(wrapRequest(req));
    if (res.status === 302 && res.headers.get('location')?.includes('error=')) {
      // Intercept the error redirect and return a debug screen!
      return new Response(JSON.stringify({
        message: 'NEXTAUTH DEBUG INTERCEPTOR',
        location: res.headers.get('location'),
        originalUrl: req.url,
        rewrittenUrl: wrapRequest(req).url,
        headers: Object.fromEntries(req.headers.entries()),
        env: {
          hasClientId: !!process.env.DISCORD_CLIENT_ID,
          hasClientSecret: !!process.env.DISCORD_CLIENT_SECRET,
          hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        }
      }, null, 2), { status: 500, headers: { 'content-type': 'application/json' } });
    }
    return res;
  } catch (e: any) {
    return new Response(e.stack || e.message, { status: 500 });
  }
};
export const POST = async (req: NextRequest) => {
  try {
    const res = await handlers.POST(wrapRequest(req));
    if (res.status === 302 && res.headers.get('location')?.includes('error=')) {
      return new Response(JSON.stringify({
        message: 'NEXTAUTH POST DEBUG INTERCEPTOR',
        location: res.headers.get('location'),
        originalUrl: req.url,
        rewrittenUrl: wrapRequest(req).url,
        env: {
          hasClientId: !!process.env.DISCORD_CLIENT_ID,
          hasClientSecret: !!process.env.DISCORD_CLIENT_SECRET,
          hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        }
      }, null, 2), { status: 500, headers: { 'content-type': 'application/json' } });
    }
    return res;
  } catch (e: any) {
    return new Response(e.stack || e.message, { status: 500 });
  }
};
