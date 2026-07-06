FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/bot/package.json apps/bot/
COPY packages/*/package.json packages/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm turbo build --filter=@logger/bot

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/bot/package.json ./
CMD ["node", "dist/index.js"]
