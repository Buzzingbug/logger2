# Logger

A comprehensive Discord logging bot with 70+ event types, web dashboard, and support for 100+ servers.

## Features

- **70+ Log Types** — Messages, members, voice, channels, roles, moderation, invites, emojis, threads, and more
- **Web Dashboard** — Next.js dashboard with real-time log viewer, settings, analytics, and filters
- **Full-Text Search** — Search through all logs with PostgreSQL full-text search
- **Customizable Embeds** — Custom colors, footers, and avatar display per server
- **Auto-Cleanup** — Configurable retention periods for log data
- **Sharded** — Native discord.js sharding for 100+ server support
- **Background Jobs** — BullMQ workers for async processing and scheduled tasks

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Bot | discord.js v14, TypeScript |
| Dashboard | Next.js 15, React 19, shadcn/ui, Tailwind CSS |
| Database | PostgreSQL 16, Prisma 7 |
| Cache | Redis 8, ioredis |
| Job Queue | BullMQ v5 |
| Auth | NextAuth.js v5, Discord OAuth2 |
| Monorepo | Turborepo, pnpm workspaces |
| Deployment | Railway, Docker |

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+
- PostgreSQL 16+
- Redis 8+

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/logger.git
   cd logger
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

4. Generate Prisma client:
   ```bash
   pnpm db:generate
   ```

5. Push database schema:
   ```bash
   pnpm db:push
   ```

6. Deploy slash commands:
   ```bash
   pnpm deploy:commands
   ```

7. Start development:
   ```bash
   pnpm dev
   ```

### Railway Deployment

1. Create a PostgreSQL database on Railway
2. Create a Redis database on Railway
3. Create 3 services: Bot, Dashboard, Worker
4. Set environment variables in Railway dashboard
5. Deploy!

## Project Structure

```
logger/
├── apps/
│   ├── bot/           # Discord bot (sharded)
│   ├── dashboard/     # Next.js web dashboard
│   └── worker/        # BullMQ background workers
├── packages/
│   ├── db/            # Prisma schema + client
│   ├── config/        # Environment validation
│   ├── types/         # Shared TypeScript types
│   └── utils/         # Logger, Redis, helpers
├── turbo.json
└── pnpm-workspace.yaml
```

## Commands

| Command | Description |
|---------|-------------|
| `/logs view [type]` | View recent logs |
| `/logs search <query>` | Search through logs |
| `/logs user <target>` | Filter by user |
| `/config` | Open dashboard |
| `/stats` | View statistics |
| `/help` | Show help |

## License

MIT
