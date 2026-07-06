import { prisma } from '@logger/db';

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const stats = await prisma.dailyStats.findMany({
    where: { guildId: id },
    orderBy: { date: 'desc' },
    take: 30,
  });

  const totalEvents = stats.reduce((sum, s) => sum + s.totalEvents, 0);
  const totalMessages = stats.reduce((sum, s) => sum + s.messageEvents, 0);
  const totalMembers = stats.reduce((sum, s) => sum + s.memberEvents, 0);
  const totalVoice = stats.reduce((sum, s) => sum + s.voiceEvents, 0);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Analytics</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-zinc-400 text-sm">Total Events</p>
          <p className="text-3xl font-bold text-white mt-1">{totalEvents.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-zinc-400 text-sm">Messages</p>
          <p className="text-3xl font-bold text-white mt-1">{totalMessages.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-zinc-400 text-sm">Members</p>
          <p className="text-3xl font-bold text-white mt-1">{totalMembers.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-zinc-400 text-sm">Voice</p>
          <p className="text-3xl font-bold text-white mt-1">{totalVoice.toLocaleString()}</p>
        </div>
      </div>

      {/* Daily breakdown */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Activity</h3>

        {stats.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">No analytics data yet</p>
        ) : (
          <div className="space-y-2">
            {stats.map((stat) => (
              <div key={stat.id} className="flex items-center gap-4">
                <span className="text-zinc-400 text-sm w-24">
                  {new Date(stat.date).toLocaleDateString()}
                </span>
                <div className="flex-1 h-6 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5865f2] rounded-full"
                    style={{
                      width: `${Math.min((stat.totalEvents / Math.max(...stats.map((s) => s.totalEvents), 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-white text-sm w-16 text-right">{stat.totalEvents}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
