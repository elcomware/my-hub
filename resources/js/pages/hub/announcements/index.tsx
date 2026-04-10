import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AnnouncementCard } from '@/components/hub/announcement-card';
import { HubHeroCard } from '@/components/hub/hub-hero-card';
import { HubSectionCard } from '@/components/hub/hub-section-card';
import HubLayout from '@/layouts/hub-layout';
import type { Announcement } from '@/types';

type Props = {
    announcements: {
        data: Announcement[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    unreadCount: number;
};

const filterChips = ['All', 'Urgent', 'Event', 'Info'] as const;

function AnnouncementsFeed({ announcements, unreadCount }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';
    const [activeFilter, setActiveFilter] = useState<string>('All');

    const filtered = useMemo(
        () =>
            activeFilter === 'All'
                ? announcements.data
                : announcements.data.filter(
                      (a) => a.tag.toLowerCase() === activeFilter.toLowerCase(),
                  ),
        [announcements.data, activeFilter],
    );

    const markAllRead = () => {
        router.post(
            `/${teamSlug}/announcements/mark-all-read`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Updates" />
            <div className="px-3.5 py-3.5">
                <HubHeroCard
                    eyebrow="Updates feed"
                    title="Stay on top of what changed"
                    description={
                        unreadCount > 0
                            ? `${unreadCount} unread updates need attention.`
                            : 'You are all caught up.'
                    }
                    meta={
                        unreadCount > 0 ? (
                            <button
                                onClick={markAllRead}
                                className="flex items-center gap-1 rounded-full bg-white/14 px-3 py-1.5 text-[11px] font-semibold text-white"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                Mark all
                            </button>
                        ) : null
                    }
                    className="mb-3.5"
                />

                <div className="mb-3 flex flex-wrap gap-2">
                    {filterChips.map((chip) => (
                        <button
                            key={chip}
                            onClick={() => setActiveFilter(chip)}
                            className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                                activeFilter === chip
                                    ? 'border-[#3A9828] bg-[#3A9828] text-white'
                                    : 'border-[#D9D2C8] bg-[#F5F2ED] text-[#5F5E5A] hover:border-[#BEB7AB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400'
                            }`}
                        >
                            {chip}
                        </button>
                    ))}
                </div>

                <HubSectionCard>
                    <div className="space-y-2.5">
                        {filtered.length > 0 ? (
                            filtered.map((a) => (
                                <AnnouncementCard
                                    key={a.id}
                                    announcement={a}
                                    teamSlug={teamSlug}
                                />
                            ))
                        ) : (
                            <div className="rounded-[18px] border border-[#E8E1D8] bg-white p-8 text-center shadow-[0_6px_16px_rgba(37,37,37,0.04)] dark:border-neutral-800 dark:bg-neutral-900">
                                <p className="text-sm text-[#888780]">
                                    No announcements found.
                                </p>
                            </div>
                        )}
                    </div>
                </HubSectionCard>

                {announcements.last_page > 1 && (
                    <div className="mt-4 flex justify-center gap-1">
                        {announcements.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`rounded-full px-3 py-1.5 text-[11px] font-medium ${
                                    link.active
                                        ? 'bg-[#252525] text-white'
                                        : 'bg-white text-[#888780] hover:bg-[#F5F2ED]'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

AnnouncementsFeed.layout = (page: React.ReactNode) => (
    <HubLayout>{page}</HubLayout>
);

export default AnnouncementsFeed;
