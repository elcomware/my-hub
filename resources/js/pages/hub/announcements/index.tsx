import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCheck, Search } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
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
    filters: {
        tag: string;
        search: string;
    };
};

const filterChips = ['all', 'urgent', 'event', 'info', 'operational'] as const;
const chipLabels: Record<string, string> = { all: 'All', urgent: 'Urgent', event: 'Event', info: 'Info', operational: 'Operational' };

function AnnouncementsFeed({ announcements, unreadCount, filters }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';
    const [search, setSearch] = useState(filters.search);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    const applyFilters = useCallback(
        (overrides: Partial<typeof filters>) => {
            const params = { ...filters, ...overrides };
            router.get(`/${teamSlug}/announcements`, {
                ...(params.tag !== 'all' ? { tag: params.tag } : {}),
                ...(params.search ? { search: params.search } : {}),
            }, { preserveState: true, replace: true });
        },
        [filters, teamSlug],
    );

    const onSearchChange = (value: string) => {
        setSearch(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            applyFilters({ search: value });
        }, 300);
    };

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

                {/* Search */}
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hub-text-faint" strokeWidth={1.5} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search updates…"
                        className="w-full rounded-[12px] border-[0.5px] border-hub-border bg-hub-surface-raised py-[9px] pl-9 pr-3 text-[13px] text-hub-text placeholder:text-hub-text-faint focus:border-hub-primary focus:outline-none"
                    />
                </div>

                {/* Filter chips — Sema horizontal scroll style */}
                <div className="-mx-4 mb-4 flex gap-[7px] overflow-x-auto px-4 pb-1">
                    {filterChips.map((chip) => {
                        const active = filters.tag === chip;
                        return (
                            <button
                                key={chip}
                                onClick={() => applyFilters({ tag: chip })}
                                className={`shrink-0 whitespace-nowrap rounded-full px-[14px] py-[5px] text-[12px] font-medium transition-colors ${
                                    active
                                        ? 'bg-hub-primary text-white'
                                        : 'border-[0.5px] border-hub-border bg-hub-surface text-hub-text-muted'
                                }`}
                            >
                                {chipLabels[chip]}
                            </button>
                        );
                    })}
                </div>

                {/* Announcements list */}
                <div className="flex flex-col gap-[9px]">
                    {announcements.data.length > 0 ? (
                        announcements.data.map((a) => (
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
