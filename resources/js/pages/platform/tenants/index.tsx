import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Tenant = {
    id: number;
    name: string;
    slug: string;
    status: string;
    sector: string | null;
    primaryColor: string | null;
    membersCount: number;
    appsCount: number;
    announcementsCount: number;
    createdAt: string;
};

type Props = {
    tenants: {
        data: Tenant[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    statusCounts: Record<string, number>;
    filters: { search: string; status: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Platform', href: '/platform/tenants' },
    { title: 'Tenants', href: '/platform/tenants' },
];

const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    trial: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    suspended: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    archived: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
};

export default function PlatformTenants({ tenants, statusCounts, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    const applyFilters = useCallback(
        (overrides: Partial<typeof filters>) => {
            const params = { ...filters, ...overrides };
            router.get('/platform/tenants', {
                ...(params.search ? { search: params.search } : {}),
                ...(params.status !== 'all' ? { status: params.status } : {}),
            }, { preserveState: true, replace: true });
        },
        [filters],
    );

    const onSearchChange = (value: string) => {
        setSearch(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            applyFilters({ search: value });
        }, 300);
    };

    const totalTenants = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    const statusTabs = [
        { key: 'all', label: 'All', count: totalTenants },
        { key: 'active', label: 'Active', count: statusCounts.active ?? 0 },
        { key: 'trial', label: 'Trial', count: statusCounts.trial ?? 0 },
        { key: 'suspended', label: 'Suspended', count: statusCounts.suspended ?? 0 },
        { key: 'archived', label: 'Archived', count: statusCounts.archived ?? 0 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Platform — Tenants" />
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-xl font-bold">Tenant Directory</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage all organisations on the platform.
                    </p>
                </div>

                {/* Search + status tabs */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-xs flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search tenants…"
                            className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-1">
                        {statusTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => applyFilters({ status: tab.key })}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filters.status === tab.key
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tenant table */}
                <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-muted-foreground">
                                <th className="px-4 py-3 font-medium">Organisation</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Sector</th>
                                <th className="px-4 py-3 font-medium text-center">Members</th>
                                <th className="px-4 py-3 font-medium text-center">Apps</th>
                                <th className="px-4 py-3 font-medium">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.data.map((t) => (
                                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/platform/tenants/${t.slug}`}
                                            className="flex items-center gap-2 font-medium hover:underline"
                                        >
                                            {t.primaryColor && (
                                                <span
                                                    className="inline-block h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: t.primaryColor }}
                                                />
                                            )}
                                            {t.name}
                                        </Link>
                                        <span className="text-xs text-muted-foreground">/{t.slug}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[t.status] ?? statusColors.active}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {t.sector || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-center">{t.membersCount}</td>
                                    <td className="px-4 py-3 text-center">{t.appsCount}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(t.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {tenants.data.length === 0 && (
                        <p className="p-8 text-center text-sm text-muted-foreground">
                            No tenants found.
                        </p>
                    )}
                </div>

                {/* Pagination */}
                {tenants.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {tenants.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
