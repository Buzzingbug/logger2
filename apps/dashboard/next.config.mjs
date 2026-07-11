/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@logger/db', '@logger/config', '@logger/types', '@logger/utils'],
  env: {
    AUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_TRUST_HOST: "true",
    AUTH_DISCORD_ID: process.env.DISCORD_CLIENT_ID,
    AUTH_DISCORD_SECRET: process.env.DISCORD_CLIENT_SECRET
  },
};

export default nextConfig;
