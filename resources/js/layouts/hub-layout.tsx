import { Link, usePage } from '@inertiajs/react';
import {
    AppWindow,
    Home,
    Inbox,
    Megaphone,
    User,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { HubHeader } from '@/components/hub/hub-header';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { HubBranding } from '@/types';

type TabItem = {
    name: string;
    href: string;
    icon: typeof Home;
    matchPrefix: string;
    badge?: number;
};

export default function HubLayout({ children }: { children: ReactNode }) {
    const { currentTeam, hubBranding, unreadAnnouncementsCount, unreadInboxCount } =
        usePage().props;
    const teamSlug = currentTeam?.slug ?? '';
    const { isCurrentUrl } = useCurrentUrl();
    const timeLabel = new Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date());
    const branding: HubBranding =
        (hubBranding as HubBranding | null) ?? {
            name: currentTeam?.name ?? 'LumaHub',
            primaryColor: '#252525',
            description: 'branded organisation portal',
        };

    const tabs: TabItem[] = [
        {
            name: 'Home',
            href: `/${teamSlug}/hub`,
            icon: Home,
            matchPrefix: `/${teamSlug}/hub`,
        },
        {
            name: 'Apps',
            href: `/${teamSlug}/apps`,
            icon: AppWindow,
            matchPrefix: `/${teamSlug}/apps`,
        },
        {
            name: 'Updates',
            href: `/${teamSlug}/announcements`,
            icon: Megaphone,
            matchPrefix: `/${teamSlug}/announcements`,
            badge: (unreadAnnouncementsCount as number) || undefined,
        },
        {
            name: 'Inbox',
            href: `/${teamSlug}/inbox`,
            icon: Inbox,
            matchPrefix: `/${teamSlug}/inbox`,
            badge: (unreadInboxCount as number) || undefined,
        },
        {
            name: 'Profile',
            href: `/${teamSlug}/profile`,
            icon: User,
            matchPrefix: `/${teamSlug}/profile`,
        },
    ];

    const isActive = (tab: TabItem) => {
        if (tab.matchPrefix === `/${teamSlug}/hub`) {
            return isCurrentUrl(tab.href);
        }

        return isCurrentUrl(tab.href, undefined, true);
    };

    return (
        <div className="min-h-screen bg-[#F4F0EA] px-0 sm:px-6 sm:py-8 dark:bg-neutral-950">
            <div className="mx-auto flex min-h-screen w-full flex-col overflow-hidden bg-[#FBF8F4] sm:min-h-[760px] sm:max-w-[360px] sm:rounded-[42px] sm:border-[1.5px] sm:border-[#CFC9BE] sm:shadow-[0_22px_60px_rgba(37,37,37,0.10)] lg:max-w-[380px] dark:bg-neutral-950 dark:sm:border-neutral-800">
                <div className="relative bg-[#252525] px-5 pb-2 pt-3">
                    <div className="absolute left-1/2 top-0 h-2.5 w-20 -translate-x-1/2 rounded-b-[14px] bg-[#252525]" />
                    <div className="flex items-center justify-between pt-1 text-[11px] font-medium tracking-[0.01em] text-white/75">
                        <span>{timeLabel}</span>
                        <span className="text-[13px] text-white/40">●●●</span>
                    </div>
                </div>

                <HubHeader branding={branding} unreadCount={unreadInboxCount as number} />

                <main className="flex-1 overflow-y-auto bg-[#FBF8F4] dark:bg-neutral-950">
                    {children}
                </main>

                <nav className="border-t border-[#E8E1D8] bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex justify-around px-2 py-2 pb-[env(safe-area-inset-bottom)]">
                        {tabs.map((tab) => {
                            const active = isActive(tab);

                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`relative flex flex-col items-center gap-0.5 rounded-[10px] px-3 py-1.5 text-center transition-colors ${
                                        active
                                            ? 'bg-[#F4F8F1] text-[#3A9828]'
                                            : 'text-[#888780] hover:text-[#555]'
                                    }`}
                                >
                                    <tab.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                                    <span className="text-[10px] font-medium leading-tight">
                                        {tab.name}
                                    </span>
                                    {tab.badge && tab.badge > 0 && (
                                        <span className="absolute right-0 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8B1A3C] px-1 text-[9px] font-bold text-white">
                                            {tab.badge > 99 ? '99+' : tab.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="flex justify-center pb-2">
                        <div className="h-1 w-24 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                </nav>
            </div>
        </div>
    );
}

