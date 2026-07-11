import { prisma } from '@logger/db';


export default async function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let guild = await prisma.guild.findUnique({
    where: { guildId: id },
  });

  if (!guild) {
    guild = await prisma.guild.create({
      data: {
        guildId: id,
        name: 'Unknown Server',
      },
    });
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Settings</h2>

      <form className="space-y-6">
        {/* Logging Toggle */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">General</h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Enable Logging</p>
                <p className="text-sm text-zinc-400">Turn logging on or off for this server</p>
              </div>
              <input
                type="checkbox"
                name="logEnabled"
                defaultChecked={guild.logEnabled}
                className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-[#5865f2] focus:ring-[#5865f2]"
              />
            </label>

            <div>
              <label className="block font-medium text-white mb-2">Log Channel ID</label>
              <input
                type="text"
                name="logChannelId"
                defaultValue={guild.logChannelId || ''}
                placeholder="Enter channel ID"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
              />
            </div>

            <div>
              <label className="block font-medium text-white mb-2">Embed Color</label>
              <input
                type="color"
                name="embedColor"
                defaultValue={guild.embedColor}
                className="w-12 h-10 rounded border-zinc-700 bg-zinc-800 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-medium text-white mb-2">Retention Days</label>
              <input
                type="number"
                name="retentionDays"
                defaultValue={guild.retentionDays}
                min={1}
                max={365}
                className="w-32 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
              />
            </div>
          </div>
        </div>

        {/* Event Toggles */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Event Types</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'logMessages', label: 'Messages' },
              { name: 'logMembers', label: 'Members' },
              { name: 'logVoice', label: 'Voice' },
              { name: 'logChannels', label: 'Channels' },
              { name: 'logRoles', label: 'Roles' },
              { name: 'logServer', label: 'Server' },
              { name: 'logModeration', label: 'Moderation' },
              { name: 'logInvites', label: 'Invites' },
              { name: 'logEmojis', label: 'Emojis' },
              { name: 'logThreads', label: 'Threads' },
              { name: 'logWebhooks', label: 'Webhooks' },
              { name: 'logScheduled', label: 'Scheduled Events' },
              { name: 'logPolls', label: 'Polls' },
              { name: 'logAutomod', label: 'Automod' },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name={name}
                  defaultChecked={(guild as any)[name]}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-[#5865f2] focus:ring-[#5865f2]"
                />
                <span className="text-white">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
