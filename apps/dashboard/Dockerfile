FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/dashboard/package.json apps/dashboard/
COPY packages/*/package.json packages/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm turbo build --filter=@logger/dashboard

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/dashboard/.next ./.next
COPY --from=builder /app/apps/dashboard/node_modules ./node_modules
COPY --from=builder /app/apps/dashboard/package.json ./
COPY --from=builder /app/apps/dashboard/public ./public
EXPOSE 3000
CMD ["npm", "start"]
