import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@logger/db';

if (process.env.NEXTAUTH_URL) {
  const baseUrl = process.env.NEXTAUTH_URL.endsWith('/') 
    ? process.env.NEXTAUTH_URL.slice(0, -1) 
    : process.env.NEXTAUTH_URL;
  
  // Force Auth.js to use the correct absolute URL, fixing both Railway's localhost proxy bug 
  // and Auth.js beta 25's base path parsing bug.
  process.env.AUTH_URL = `${baseUrl}/api/auth`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: '/api/auth',
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
