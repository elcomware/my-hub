import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AnnouncementCard } from '@/components/hub/announcement-card';
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

const filterChips = ['All', 'Urgent', 'Event', 'Info', 'Operational'] as const;

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
            <div className="px-4 py-4">
                {/* Header area */}
                <div className="mb-4">
                    <p className="font-hub-serif text-[20px] font-semibold text-hub-text">
                        Updates
                    </p>
                    {unreadCount > 0 && (
                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-[12px] text-hub-text-muted">
                                {unreadCount} unread
                            </p>
                            <button
                                onClick={markAllRead}
                                className="flex items-center gap-1 rounded-full bg-hub-surface px-3 py-1.5 text-[11px] font-medium text-hub-text-muted transition-colors hover:bg-hub-border"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                Mark all read
                            </button>
                        </div>
                    )}
                </div>

                {/* Filter chips — Sema horizontal scroll style */}
                <div className="-mx-4 mb-4 flex gap-[7px] overflow-x-auto px-4 pb-1">
                    {filterChips.map((chip) => {
                        const active = activeFilter === chip;
                        return (
                            <button
                                key={chip}
                                onClick={() => setActiveFilter(chip)}
                                className={`shrink-0 whitespace-nowrap rounded-full px-[14px] py-[5px] text-[12px] font-medium transition-colors ${
                                    active
                                        ? 'bg-hub-primary text-white'
                                        : 'border-[0.5px] border-hub-border bg-hub-surface text-hub-text-muted'
                                }`}
                            >
                                {chip}
                            </button>
                        );
                    })}
                </div>

                {/* Announcements list */}
                <div className="flex flex-col gap-[9px]">
                    {filtered.length > 0 ? (
                        filtered.map((a) => (
                            <AnnouncementCard
                                key={a.id}
                                announcement={a}
                                teamSlug={teamSlug}
                            />
                        ))
                    ) : (
                        <div className="rounded-[14px] border-[0.5px] border-hub-border bg-hub-surface-raised p-8 text-center">
                            <p className="text-sm text-hub-text-faint">
                                No announcements found.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {announcements.last_page > 1 && (
                    <div className="mt-4 flex justify-center gap-1">
                        {announcements.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                                    link.active
                                        ? 'bg-hub-primary text-white'
                                        : 'bg-hub-surface-raised text-hub-text-faint hover:bg-hub-surface'
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
