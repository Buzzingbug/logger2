import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

const request = new Request('https://logger2-production.up.railway.app/api/auth/signin/discord');

async function run() {
  const { handlers } = NextAuth({
    basePath: '/api/auth',
    trustHost: true,
    secret: '12345678901234567890123456789012',
    providers: [
      DiscordProvider({ clientId: '123', clientSecret: '123' })
    ]
  });
  
  const response = await handlers.GET(request);
  console.log(response.status);
  const text = await response.text();
  console.log(text);
}

run();
