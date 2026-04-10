import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type TenantDetail = {
    id: number;
    name: string;
    slug: string;
    status: string;
    sector: string | null;
    description: string | null;
    primaryColor: string | null;
    accentColor: string | null;
    logoPath: string | null;
    membersCount: number;
    appsCount: number;
    announcementsCount: number;
    invitationsCount: number;
    ownerName: string | null;
    ownerEmail: string | null;
    createdAt: string;
    updatedAt: string;
};

type Props = {
    tenant: TenantDetail;
};

const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    trial: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    suspended: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    archived: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
};

const statusActions: Record<string, { label: string; target: string; variant: string }[]> = {
    active: [
        { label: 'Suspend', target: 'suspended', variant: 'text-amber-600' },
        { label: 'Archive', target: 'archived', variant: 'text-neutral-500' },
    ],
    trial: [
        { label: 'Activate', target: 'active', variant: 'text-emerald-600' },
        { label: 'Suspend', target: 'suspended', variant: 'text-amber-600' },
    ],
    suspended: [
        { label: 'Reactivate', target: 'active', variant: 'text-emerald-600' },
        { label: 'Archive', target: 'archived', variant: 'text-neutral-500' },
    ],
    archived: [
        { label: 'Reactivate', target: 'active', variant: 'text-emerald-600' },
    ],
};

export default function PlatformTenantShow({ tenant }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Platform', href: '/platform/tenants' },
        { title: 'Tenants', href: '/platform/tenants' },
        { title: tenant.name, href: `/platform/tenants/${tenant.slug}` },
    ];

    const changeStatus = (status: string) => {
        if (!confirm(`Change ${tenant.name} status to "${status}"?`)) return;
        router.patch(`/platform/tenants/${tenant.slug}/status`, { status }, { preserveScroll: true });
    };

    const actions = statusActions[tenant.status] ?? statusActions.active;

    const infoRows = [
        { label: 'Slug', value: `/${tenant.slug}` },
        { label: 'Sector', value: tenant.sector || '—' },
        { label: 'Owner', value: tenant.ownerName ? `${tenant.ownerName} (${tenant.ownerEmail})` : '—' },
        { label: 'Description', value: tenant.description || '—' },
        { label: 'Created', value: new Date(tenant.createdAt).toLocaleDateString() },
        { label: 'Updated', value: new Date(tenant.updatedAt).toLocaleDateString() },
    ];

    const statCards = [
        { label: 'Members', value: tenant.membersCount, icon: '👥' },
        { label: 'Apps', value: tenant.appsCount, icon: '📱' },
        { label: 'Announcements', value: tenant.announcementsCount, icon: '📢' },
        { label: 'Pending invites', value: tenant.invitationsCount, icon: '✉️' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${tenant.name} — Platform`} />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
                <Link
                    href="/platform/tenants"
                    className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to tenants
                </Link>

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {tenant.primaryColor && (
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-white text-lg font-bold"
                                style={{ backgroundColor: tenant.primaryColor }}
                            >
                                {tenant.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h1 className="text-xl font-bold">{tenant.name}</h1>
                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[tenant.status] ?? statusColors.active}`}>
                                {tenant.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {actions.map((action) => (
                            <button
                                key={action.target}
                                onClick={() => changeStatus(action.target)}
                                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted ${action.variant}`}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {statCards.map((card) => (
                        <div key={card.label} className="rounded-xl border bg-card p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{card.icon}</span>
                                {card.label}
                            </div>
                            <p className="mt-1 text-2xl font-bold">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Details */}
                <div className="rounded-xl border bg-card p-4">
                    <h2 className="mb-3 text-sm font-semibold">Organisation Details</h2>
                    <dl className="space-y-2.5">
                        {infoRows.map((row) => (
                            <div key={row.label} className="flex text-sm">
                                <dt className="w-28 shrink-0 text-muted-foreground">{row.label}</dt>
                                <dd>{row.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Brand preview */}
                {(tenant.primaryColor || tenant.accentColor) && (
                    <div className="rounded-xl border bg-card p-4">
                        <h2 className="mb-3 text-sm font-semibold">Brand Colors</h2>
                        <div className="flex gap-3">
                            {tenant.primaryColor && (
                                <div className="flex items-center gap-2">
                                    <span
                                        className="inline-block h-8 w-8 rounded-lg border"
                                        style={{ backgroundColor: tenant.primaryColor }}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        Primary: {tenant.primaryColor}
                                    </span>
                                </div>
                            )}
                            {tenant.accentColor && (
                                <div className="flex items-center gap-2">
                                    <span
                                        className="inline-block h-8 w-8 rounded-lg border"
                                        style={{ backgroundColor: tenant.accentColor }}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        Accent: {tenant.accentColor}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick links */}
                <div className="rounded-xl border bg-card p-4">
                    <h2 className="mb-3 text-sm font-semibold">Quick Links</h2>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={`/${tenant.slug}/hub`}
                            className="rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                        >
                            View hub →
                        </Link>
                        <Link
                            href={`/${tenant.slug}/admin/analytics`}
                            className="rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                        >
                            Tenant analytics →
                        </Link>
                        <Link
                            href={`/${tenant.slug}/admin/branding`}
                            className="rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                        >
                            Branding →
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
