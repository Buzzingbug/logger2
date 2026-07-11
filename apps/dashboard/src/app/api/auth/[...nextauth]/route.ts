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

export const GET = (req: NextRequest) => handlers.GET(wrapRequest(req));
export const POST = (req: NextRequest) => handlers.POST(wrapRequest(req));
