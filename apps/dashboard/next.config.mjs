/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@logger/db', '@logger/config', '@logger/types', '@logger/utils'],
};

export default nextConfig;
