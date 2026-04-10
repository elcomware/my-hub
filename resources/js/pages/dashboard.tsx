import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Announcement = {
    id: number;
    title: string;
    tag: string;
    authorName: string;
    publishedAt: string;
};

type Props = {
    stats: {
        memberCount: number;
        appCount: number;
        unreadAnnouncements: number;
        pendingInvitations: number;
    };
    recentAnnouncements: Announcement[];
    teamRole: string;
};

const tagColors: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    event: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    operational: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
};

export default function Dashboard({ stats, recentAnnouncements, teamRole }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: `/${teamSlug}/dashboard` },
    ];

    const isAdmin = ['owner', 'admin', 'manager'].includes(teamRole);

    const statCards = [
        { label: 'Members', value: stats.memberCount, icon: '👥', href: isAdmin ? `/settings/teams/${teamSlug}` : null },
        { label: 'Apps', value: stats.appCount, icon: '📱', href: isAdmin ? `/${teamSlug}/admin/apps` : `/${teamSlug}/apps` },
        { label: 'Unread updates', value: stats.unreadAnnouncements, icon: '🔔', href: `/${teamSlug}/announcements` },
        { label: 'Pending invites', value: stats.pendingInvitations, icon: '✉️', href: isAdmin ? `/settings/teams/${teamSlug}` : null },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
                {/* Greeting */}
                <div>
                    <h1 className="text-xl font-bold">
                        {currentTeam?.name ?? 'Dashboard'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Welcome back. Here's an overview of your organisation.
                    </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {statCards.map((card) => {
                        const inner = (
                            <>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{card.icon}</span>
                                    {card.label}
                                </div>
                                <p className="mt-1 text-2xl font-bold">{card.value}</p>
                            </>
                        );

                        return card.href ? (
                            <Link
                                key={card.label}
                                href={card.href}
                                className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/30"
                            >
                                {inner}
                            </Link>
                        ) : (
                            <div key={card.label} className="rounded-xl border bg-card p-4">
                                {inner}
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent announcements */}
                    <div className="rounded-xl border bg-card p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold">Recent Updates</h2>
                            <Link
                                href={`/${teamSlug}/announcements`}
                                className="text-xs text-muted-foreground hover:text-foreground"
                            >
                                View all →
                            </Link>
                        </div>
                        <div className="space-y-2.5">
                            {recentAnnouncements.map((a) => (
                                <Link
                                    key={a.id}
                                    href={`/${teamSlug}/announcements/${a.id}`}
                                    className="block rounded-lg p-2 transition-colors hover:bg-muted/30"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${tagColors[a.tag] ?? tagColors.info}`}>
                                            {a.tag}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(a.publishedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm font-medium">{a.title}</p>
                                </Link>
                            ))}
                            {recentAnnouncements.length === 0 && (
                                <p className="text-sm text-muted-foreground">No announcements yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="rounded-xl border bg-card p-4">
                        <h2 className="mb-3 text-sm font-semibold">Quick Actions</h2>
                        <div className="flex flex-col gap-2">
                            <Link
                                href={`/${teamSlug}/hub`}
                                className="rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/30"
                            >
                                🏠 Open Hub
                            </Link>
                            <Link
                                href={`/${teamSlug}/apps`}
                                className="rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/30"
                            >
                                📱 Browse Apps
                            </Link>
                            {isAdmin && (
                                <>
                                    <Link
                                        href={`/${teamSlug}/admin/announcements`}
                                        className="rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/30"
                                    >
                                        📢 Manage Announcements
                                    </Link>
                                    <Link
                                        href={`/${teamSlug}/admin/analytics`}
                                        className="rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/30"
                                    >
                                        📊 View Analytics
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
