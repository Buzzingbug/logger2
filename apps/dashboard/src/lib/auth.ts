import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@logger/db';

// Map existing env vars to Auth.js v5 expected env vars
process.env.AUTH_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
process.env.AUTH_URL = process.env.AUTH_URL || process.env.NEXTAUTH_URL;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
  pages: {
    signIn: '/login',
  },
});
