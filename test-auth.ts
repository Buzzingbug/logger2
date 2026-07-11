import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const { handlers, auth } = NextAuth({
  secret: 'a-very-long-secret-key-1234567890',
  trustHost: true,
  providers: [
    DiscordProvider({
      clientId: '123',
      clientSecret: '123',
    }),
  ],
});
console.log('Success');
