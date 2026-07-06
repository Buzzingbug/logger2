import { prisma } from '@logger/db';
import { timeAgo } from '@/lib/utils';

const EVENT_COLORS: Record<string, string> = {
  message_delete: 'text-red-400',
  message_edit: 'text-yellow-400',
  member_join: 'text-green-400',
  member_leave: 'text-red-400',
  voice_join: 'text-green-400',
  voice_leave: 'text-red-400',
  channel_create: 'text-green-400',
  channel_delete: 'text-red-400',
  role_create: 'text-green-400',
  role_delete: 'text-red-400',
  mod_ban: 'text-red-400',
  mod_kick: 'text-red-400',
};

export default async function LogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const category = (sp.category as string) || 'all';
  const limit = 50;

  const where: any = { guildId: id };
  if (category !== 'all') where.category = category;

  const [events, total] = await Promise.all([
    prisma.logEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.logEvent.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Logs</h2>
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 text-sm">{total} total events</span>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'messages', 'members', 'voice', 'channels', 'roles', 'moderation'].map((cat) => (
          <a
            key={cat}
            href={`/server/${id}/logs?category=${cat}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-[#5865f2] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </a>
        ))}
      </div>

      {/* Log entries */}
      {events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400">No logs found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center gap-4"
            >
              <div className={`w-2 h-2 rounded-full ${EVENT_COLORS[event.eventType] || 'bg-zinc-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{event.eventType}</span>
                  <span className="text-zinc-500 text-sm">•</span>
                  <span className="text-zinc-400 text-sm">{event.category}</span>
                </div>
                {event.userId && (
                  <p className="text-zinc-500 text-sm mt-1">User: {event.userId}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-zinc-400 text-sm">{timeAgo(event.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <a
              href={`/server/${id}/logs?page=${page - 1}&category=${category}`}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              Previous
            </a>
          )}
          <span className="text-zinc-400 text-sm">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/server/${id}/logs?page=${page + 1}&category=${category}`}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              Next
            </a>
          )}
        </div>
      )}
    </div>
  );
}
