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

            <div className="px-4 py-4">
                {/* Stats row — Sema-style compact stat boxes */}
                <div className="mb-4 grid grid-cols-3 gap-2">
                    <div className="rounded-[12px] border-[0.5px] border-hub-border bg-hub-surface-raised p-[10px] text-center">
                        <p className="font-hub-serif text-[18px] font-semibold text-hub-danger">
                            {stats.unreadAnnouncements}
                        </p>
                        <p className="mt-0.5 text-[10px] text-hub-text-faint">
                            unread
                        </p>
                    </div>
                    <div className="rounded-[12px] border-[0.5px] border-hub-border bg-hub-surface-raised p-[10px] text-center">
                        <p className="font-hub-serif text-[18px] font-semibold text-hub-success">
                            {stats.newUpdates}
                        </p>
                        <p className="mt-0.5 text-[10px] text-hub-text-faint">
                            new updates
                        </p>
                    </div>
                    <div className="rounded-[12px] border-[0.5px] border-hub-border bg-hub-primary/10 p-[10px] text-center">
                        <p className="font-hub-serif text-[18px] font-semibold text-hub-primary">
                            {stats.upcomingEvents}
                        </p>
                        <p className="mt-0.5 text-[10px] text-hub-text-faint">
                            events
                        </p>
                    </div>
                </div>

                {/* Hero card — branded CTA */}
                <HubHeroCard
                    eyebrow={`${currentTeam?.name ?? 'Hub'} · Your dashboard`}
                    title="What would you like to open today?"
                    className="mb-4"
                >
                    <div className="flex gap-2">
                        <Link
                            href={`/${teamSlug}/apps`}
                            className="flex-1 rounded-[10px] bg-white/[0.18] py-[9px] text-center text-[12px] font-medium text-white"
                        >
                            Apps
                        </Link>
                        <Link
                            href={`/${teamSlug}/announcements`}
                            className="flex-1 rounded-[10px] bg-white/[0.18] py-[9px] text-center text-[12px] font-medium text-white"
                        >
                            Updates
                        </Link>
                        <Link
                            href={`/${teamSlug}/inbox`}
                            className="flex-1 rounded-[10px] bg-white/[0.18] py-[9px] text-center text-[12px] font-medium text-white"
                        >
                            Inbox
                        </Link>
                    </div>
                </HubHeroCard>

                {/* Quick access — app tiles */}
                <HubSectionCard
                    title="Quick access"
                    action={
                        <Link
                            href={`/${teamSlug}/apps`}
                            className="text-[12px] font-medium text-hub-primary"
                        >
                            See all
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
                            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[17px] border-[0.5px] border-hub-border bg-hub-surface text-base text-hub-text-faint">
                                •••
                            </div>
                            <span className="text-center text-[10px] font-medium leading-tight text-hub-text-muted">
                                All apps
                            </span>
                        </Link>
                    </div>
                </HubSectionCard>

                {/* Latest updates */}
                <HubSectionCard
                    title="Latest updates"
                    action={
                        <Link
                            href={`/${teamSlug}/announcements`}
                            className="text-[12px] font-medium text-hub-primary"
                        >
                            See all
                        </Link>
                    }
                >
                    <div className="flex flex-col gap-[9px]">
                        {recentAnnouncements.length > 0 ? (
                            recentAnnouncements.map((a) => (
                                <AnnouncementCard
                                    key={a.id}
                                    announcement={a}
                                    teamSlug={teamSlug}
                                />
                            ))
                        ) : (
                            <div className="rounded-[14px] border-[0.5px] border-hub-border bg-hub-surface-raised p-8 text-center">
                                <p className="text-sm text-hub-text-faint">
                                    No announcements yet.
                                </p>
                            </div>
                        )}
                    </div>
                </HubSectionCard>

                {/* Network activity teaser */}
                <div className="mt-4 flex flex-col gap-[6px]">
                    <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-hub-text-faint">
                        Activity
                    </p>
                    <div className="flex items-center gap-[10px] rounded-[10px] bg-hub-surface p-[9px] px-3">
                        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-hub-success hub-pulse" />
                        <p className="text-[12px] text-hub-text-muted">
                            {stats.totalMembers} members active in this hub
                        </p>
                    </div>
                    <div className="flex items-center gap-[10px] rounded-[10px] bg-hub-surface p-[9px] px-3">
                        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-hub-primary" />
                        <p className="text-[12px] text-hub-text-muted">
                            {stats.totalApps} apps connected to your organisation
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

HubIndex.layout = (page: React.ReactNode) => <HubLayout>{page}</HubLayout>;

export default HubIndex;
