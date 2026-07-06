import { prisma } from '@logger/db';

export default async function FiltersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const filters = await prisma.logFilter.findMany({
    where: { guildId: id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Filters</h2>
        <button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Create Filter
        </button>
      </div>

      {filters.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400 mb-4">No filters created yet</p>
          <p className="text-zinc-500 text-sm">
            Filters let you create custom views of your logs based on event types, users, or channels
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-white">{filter.name}</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {filter.eventTypes.length > 0 && `Events: ${filter.eventTypes.join(', ')}`}
                  {filter.userIds.length > 0 && ` • Users: ${filter.userIds.length}`}
                  {filter.channelIds.length > 0 && ` • Channels: ${filter.channelIds.length}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-zinc-400 hover:text-white transition-colors">Edit</button>
                <button className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
