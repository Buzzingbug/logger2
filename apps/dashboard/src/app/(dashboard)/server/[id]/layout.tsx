import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@logger/db';
import { cn } from '@/lib/utils';

const tabs = [
  { name: 'Logs', href: 'logs' },
  { name: 'Settings', href: 'settings' },
  { name: 'Analytics', href: 'analytics' },
  { name: 'Filters', href: 'filters' },
];

export default async function ServerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const { id } = await params;

  const guild = await prisma.guild.findUnique({
    where: { guildId: id },
  });

  return (
    <div className="min-h-screen">
      <div className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/servers" className="text-zinc-400 hover:text-white transition-colors">
              ← Servers
            </Link>
            {guild && (
              <div className="flex items-center gap-3">
                {guild.iconUrl ? (
                  <img src={guild.iconUrl} alt={guild.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-white">
                    {guild.name.charAt(0)}
                  </div>
                )}
                <h1 className="text-xl font-bold text-white">{guild.name}</h1>
              </div>
            )}
          </div>

          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={`/server/${id}/${tab.href}`}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  'text-zinc-400 hover:text-white hover:bg-zinc-800',
                )}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
    </div>
  );
}
