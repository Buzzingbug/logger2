const { NextAuth } = require('@auth/core');
const DiscordProvider = require('@auth/core/providers/discord').default;

try {
  NextAuth({
    secret: '12345678901234567890123456789012',
    trustHost: true,
    providers: [
      DiscordProvider({
        clientId: '123',
        clientSecret: '123',
      }),
    ],
  });
  console.log('Success');
} catch (e) {
  console.error('Error:', e);
}
