import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@logger/db';

export default async function ServersPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Get guilds where bot is present
  const guilds = await prisma.guild.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Servers</h1>
            <p className="text-zinc-400 mt-1">Select a server to manage logging</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">{session.user?.name}</span>
            <Link
              href="/api/auth/signout"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Sign Out
            </Link>
          </div>
        </div>

        {guilds.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-white mb-2">No Servers Found</h2>
            <p className="text-zinc-400 mb-6">
              Add Logger to your Discord server to get started
            </p>
            <a
              href="https://discord.com/api/oauth2/authorize"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add to Discord
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guilds.map((guild) => (
              <Link
                key={guild.id}
                href={`/server/${guild.guildId}/logs`}
                className="block bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {guild.iconUrl ? (
                    <img
                      src={guild.iconUrl}
                      alt={guild.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-white">
                      {guild.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{guild.name}</h3>
                    <p className="text-sm text-zinc-400">
                      {guild.logEnabled ? '✅ Logging enabled' : '⏸️ Logging paused'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
