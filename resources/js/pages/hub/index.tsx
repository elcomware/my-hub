import { Head, Link, usePage } from '@inertiajs/react';
import { AnnouncementCard } from '@/components/hub/announcement-card';
import { HubHeroCard } from '@/components/hub/hub-hero-card';
import { HubSectionCard } from '@/components/hub/hub-section-card';
import { QuickAccessTile } from '@/components/hub/quick-access-tile';
import HubLayout from '@/layouts/hub-layout';
import type { Announcement, HubApp, HubStats } from '@/types';

type Props = {
    pinnedApps: HubApp[];
    recentAnnouncements: Announcement[];
    stats: HubStats;
};

function HubIndex({ pinnedApps, recentAnnouncements, stats }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';

    return (
        <>
            <Head title="Hub Home" />

            <div className="px-3.5 py-3.5">
                <div className="mb-3.5 grid grid-cols-3 gap-2">
                    <div className="hub-surface rounded-[14px] p-2.5 text-center dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
                        <p className="text-xl font-bold tracking-tight text-[#8B1A3C]">
                            {stats.unreadAnnouncements}
                        </p>
                        <p className="mt-0.5 text-[10px] font-medium leading-tight text-[#888780]">
                            Unread alerts
                        </p>
                    </div>
                    <div className="hub-surface rounded-[14px] p-2.5 text-center dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
                        <p className="text-xl font-bold tracking-tight text-[#3A9828]">
                            {stats.newUpdates}
                        </p>
                        <p className="mt-0.5 text-[10px] font-medium leading-tight text-[#888780]">
                            New updates
                        </p>
                    </div>
                    <div className="hub-surface rounded-[14px] p-2.5 text-center dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
                        <p className="text-xl font-bold tracking-tight text-[#C47A10]">
                            {stats.upcomingEvents}
                        </p>
                        <p className="mt-0.5 text-[10px] font-medium leading-tight text-[#888780]">
                            Upcoming events
                        </p>
                    </div>
                </div>

                <HubHeroCard
                    eyebrow="LumaHub flow"
                    title="What would you like to open today?"
                    description="Move between tools, updates, and messages without losing context."
                    meta={
                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-medium text-white/75">
                                {pinnedApps.length} favourites ready
                            </span>
                            <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-medium text-white/75">
                                {stats.newUpdates} new updates
                            </span>
                            <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-medium text-white/75">
                                {stats.unreadAnnouncements} items to review
                            </span>
                        </div>
                    }
                    className="mb-4"
                >
                    <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-medium">
                        <Link
                            href={`/${teamSlug}/apps`}
                            className="rounded-xl bg-white/15 px-2 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                        >
                            Apps
                        </Link>
                        <Link
                            href={`/${teamSlug}/announcements`}
                            className="rounded-xl bg-white/15 px-2 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                        >
                            Updates
                        </Link>
                        <Link
                            href={`/${teamSlug}/inbox`}
                            className="rounded-xl bg-white/15 px-2 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                        >
                            Inbox
                        </Link>
                    </div>
                </HubHeroCard>

                <HubSectionCard
                    title="Quick access"
                    action={
                        <Link
                            href={`/${teamSlug}/apps`}
                            className="text-[11px] font-semibold text-[#3A9828]"
                        >
                            View all
                        </Link>
                    }
                    className="mb-4"
                >
                    <div className="grid grid-cols-4 gap-2.5">
                        {pinnedApps.slice(0, 7).map((app) => (
                            <QuickAccessTile key={app.id} app={app} />
                        ))}
                        <Link
                            href={`/${teamSlug}/apps`}
                            className="flex flex-col items-center gap-1.5 rounded-2xl p-1 outline-none transition-transform duration-150 hover:-translate-y-0.5"
                        >
                            <div className="hub-muted-surface flex h-[52px] w-[52px] items-center justify-center rounded-[17px] text-base text-[#888780] shadow-[0_6px_16px_rgba(37,37,37,0.04)]">
                                •••
                            </div>
                            <span className="text-center text-[10px] font-medium leading-tight text-[#5F5E5A]">
                                All apps
                            </span>
                        </Link>
                    </div>
                </HubSectionCard>

                <HubSectionCard
                    title="Latest updates"
                    action={
                        <Link
                            href={`/${teamSlug}/announcements`}
                            className="text-[11px] font-semibold text-[#3A9828]"
                        >
                            View all
                        </Link>
                    }
                >
                    <div className="space-y-2.5">
                        {recentAnnouncements.length > 0 ? (
                            recentAnnouncements.map((a) => (
                                <AnnouncementCard
                                    key={a.id}
                                    announcement={a}
                                    teamSlug={teamSlug}
                                />
                            ))
                        ) : (
                            <div className="rounded-[18px] border border-[#E8E1D8] bg-white p-8 text-center shadow-[0_6px_16px_rgba(37,37,37,0.04)] dark:border-neutral-800 dark:bg-neutral-900">
                                <p className="text-sm text-[#888780]">
                                    No announcements yet.
                                </p>
                            </div>
                        )}
                    </div>
                </HubSectionCard>
            </div>
        </>
    );
}

HubIndex.layout = (page: React.ReactNode) => <HubLayout>{page}</HubLayout>;

export default HubIndex;
