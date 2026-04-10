import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Stats = {
    memberCount: number;
    appCount: number;
    appLaunches: number;
    announcementCount: number;
    announcementReadRate: number;
    pendingInvitations: number;
};

type TopApp = { name: string; icon: string | null; launches: number };
type RecentMember = { name: string; email: string; role: string; joinedAt: string };

type Props = {
    stats: Stats;
    roleBreakdown: Record<string, number>;
    topApps: TopApp[];
    recentMembers: RecentMember[];
};

export default function AdminAnalytics({ stats, roleBreakdown, topApps, recentMembers }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: `/${teamSlug}/admin/analytics` },
        { title: 'Analytics', href: `/${teamSlug}/admin/analytics` },
    ];

    const statCards = [
        { label: 'Members', value: stats.memberCount, icon: '👥' },
        { label: 'Apps', value: stats.appCount, icon: '📱' },
        { label: 'App launches', value: stats.appLaunches, icon: '🚀' },
        { label: 'Announcements', value: stats.announcementCount, icon: '📢' },
        { label: 'Read rate', value: `${stats.announcementReadRate}%`, icon: '📊' },
        { label: 'Pending invites', value: stats.pendingInvitations, icon: '✉️' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-xl font-bold">Analytics Overview</h1>
                    <p className="text-sm text-muted-foreground">
                        Usage insights for {currentTeam?.name ?? 'your organisation'}.
                    </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {statCards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-xl border bg-card p-4"
                        >
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{card.icon}</span>
                                {card.label}
                            </div>
                            <p className="mt-1 text-2xl font-bold">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Role breakdown */}
                    <div className="rounded-xl border bg-card p-4">
                        <h2 className="mb-3 text-sm font-semibold">Role Breakdown</h2>
                        <div className="space-y-2">
                            {Object.entries(roleBreakdown).map(([role, count]) => (
                                <div key={role} className="flex items-center justify-between text-sm">
                                    <span className="capitalize text-muted-foreground">{role}</span>
                                    <span className="font-medium">{count}</span>
                                </div>
                            ))}
                            {Object.keys(roleBreakdown).length === 0 && (
                                <p className="text-sm text-muted-foreground">No members yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Top apps */}
                    <div className="rounded-xl border bg-card p-4">
                        <h2 className="mb-3 text-sm font-semibold">Top Apps by Launches</h2>
                        <div className="space-y-2">
                            {topApps.map((app, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <span>{app.icon || '📦'}</span>
                                        <span className="text-muted-foreground">{app.name}</span>
                                    </span>
                                    <span className="font-medium">{app.launches}</span>
                                </div>
                            ))}
                            {topApps.length === 0 && (
                                <p className="text-sm text-muted-foreground">No app launches recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent members */}
                <div className="rounded-xl border bg-card p-4">
                    <h2 className="mb-3 text-sm font-semibold">Recent Members</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="pb-2 font-medium">Name</th>
                                    <th className="pb-2 font-medium">Email</th>
                                    <th className="pb-2 font-medium">Role</th>
                                    <th className="pb-2 font-medium">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentMembers.map((m, i) => (
                                    <tr key={i} className="border-b last:border-0">
                                        <td className="py-2">{m.name}</td>
                                        <td className="py-2 text-muted-foreground">{m.email}</td>
                                        <td className="py-2">
                                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
                                                {m.role}
                                            </span>
                                        </td>
                                        <td className="py-2 text-muted-foreground">
                                            {new Date(m.joinedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {recentMembers.length === 0 && (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                No members yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
