import { Link, usePage } from '@inertiajs/react';
import {
    AppWindow,
    Bell,
    Home,
    Inbox,
    Megaphone,
    User,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useIsMobile } from '@/hooks/use-mobile';
import type { HubBranding } from '@/types';

type TabItem = {
    name: string;
    href: string;
    icon: typeof Home;
    matchPrefix: string;
    badge?: number;
    isFab?: boolean;
};

export default function HubLayout({ children }: { children: ReactNode }) {
    const { currentTeam, hubBranding, unreadAnnouncementsCount, unreadInboxCount, auth } =
        usePage().props;
    const teamSlug = currentTeam?.slug ?? '';
    const { isCurrentUrl } = useCurrentUrl();
    const isMobile = useIsMobile();
    const branding: HubBranding =
        (hubBranding as HubBranding | null) ?? {
            name: currentTeam?.name ?? 'LumaHub',
            primaryColor: '#D85A30',
            description: 'branded organisation portal',
        };

    const primaryColor = branding.primaryColor ?? '#D85A30';

    const userName = (auth as { user: { name: string } }).user.name.split(' ')[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

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
            isFab: true,
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

    const initials = (auth as { user: { name: string } }).user.name
        .split(/\s+/)
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Inject tenant branding as CSS custom properties
    const hubStyle = {
        '--hub-primary': primaryColor,
    } as React.CSSProperties;

    return (
        <div className="min-h-screen bg-hub-surface" style={hubStyle}>
            {/* ─── DESKTOP LAYOUT ─── */}
            <div className="hidden lg:flex lg:min-h-screen">
                {/* Desktop sidebar */}
                <aside className="flex w-[260px] shrink-0 flex-col border-r border-hub-border bg-hub-surface-raised">
                    {/* Brand header */}
                    <div className="flex items-center gap-3 border-b border-hub-border px-5 py-4">
                        {branding.logoPath ? (
                            <img
                                src={branding.logoPath}
                                alt={branding.name}
                                className="h-9 w-9 rounded-xl object-contain"
                            />
                        ) : (
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
                                style={{ background: primaryColor }}
                            >
                                {branding.name.charAt(0)}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-hub-text">
                                {branding.name}
                            </p>
                            {branding.description && (
                                <p className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-hub-text-faint">
                                    {branding.description.length > 35
                                        ? branding.description.slice(0, 35) + '…'
                                        : branding.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Nav items */}
                    <nav className="flex-1 space-y-0.5 px-3 py-4">
                        {tabs.map((tab) => {
                            const active = isActive(tab);
                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                                        active
                                            ? 'text-hub-primary-fg'
                                            : 'text-hub-text-muted hover:bg-hub-surface'
                                    }`}
                                    style={active ? { background: primaryColor } : undefined}
                                >
                                    <tab.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                                    <span>{tab.name}</span>
                                    {tab.badge && tab.badge > 0 && (
                                        <span
                                            className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                                            style={{ background: active ? 'rgba(255,255,255,0.25)' : primaryColor }}
                                        >
                                            {tab.badge > 99 ? '99+' : tab.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User card */}
                    <div className="border-t border-hub-border px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                style={{ background: primaryColor }}
                            >
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-[13px] font-medium text-hub-text">
                                    {(auth as { user: { name: string } }).user.name}
                                </p>
                                <p className="text-[11px] text-hub-text-faint">
                                    {currentTeam?.roleLabel ?? 'Member'}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Desktop main content */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Desktop topbar */}
                    <header className="flex items-center justify-between border-b border-hub-border bg-hub-surface-raised px-6 py-3">
                        <div>
                            <p className="text-[12px] text-hub-text-faint">{greeting}</p>
                            <p className="font-hub-serif text-xl font-semibold text-hub-text">
                                {userName}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/${teamSlug}/inbox`}
                                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-hub-border bg-hub-surface transition-colors hover:bg-hub-surface-raised"
                            >
                                <Bell className="h-4 w-4 text-hub-text-muted" />
                                {(unreadInboxCount as number) > 0 && (
                                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-hub-danger px-0.5 text-[9px] font-bold text-white ring-2 ring-hub-surface-raised">
                                        {(unreadInboxCount as number) > 99 ? '99+' : unreadInboxCount as number}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </header>

                    {/* Desktop content */}
                    <main className="flex-1 overflow-y-auto bg-hub-surface p-6">
                        <div className="mx-auto max-w-3xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* ─── MOBILE / TABLET LAYOUT ─── */}
            <div className="flex min-h-screen flex-col lg:hidden">
                {/* Mobile header */}
                <header
                    className="relative shrink-0 overflow-hidden px-4 pb-4 pt-[max(env(safe-area-inset-top,12px),12px)]"
                    style={{ backgroundColor: primaryColor }}
                >
                    {/* Decorative circles */}
                    <div className="pointer-events-none absolute -bottom-6 -right-4 h-[100px] w-[100px] rounded-full bg-white/[0.08]" />
                    <div className="pointer-events-none absolute -top-4 right-10 h-[60px] w-[60px] rounded-full bg-white/[0.05]" />

                    {/* Top row: logo + bell */}
                    <div className="relative mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            {branding.logoPath ? (
                                <img
                                    src={branding.logoPath}
                                    alt={branding.name}
                                    className="h-8 w-8 rounded-lg object-contain"
                                />
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-sm font-bold text-white">
                                    {branding.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <p className="text-[13px] font-bold leading-tight text-white">
                                    {branding.name}
                                </p>
                                {branding.description && (
                                    <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/60">
                                        {branding.description.length > 30
                                            ? branding.description.slice(0, 30) + '…'
                                            : branding.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Link
                            href={`/${teamSlug}/inbox`}
                            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 transition-colors"
                        >
                            <Bell className="h-4 w-4 text-white" />
                            {(unreadInboxCount as number) > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-hub-danger text-[8px] font-bold text-white ring-2"
                                    style={{ borderColor: primaryColor }}
                                >
                                    {(unreadInboxCount as number) > 9 ? '9+' : unreadInboxCount as number}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Greeting row */}
                    <div className="relative">
                        <p className="text-[11px] text-white/50">{greeting}</p>
                        <p className="font-hub-serif text-[25px] font-semibold leading-[1.15] tracking-tight text-white">
                            {userName}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/60">
                            <span className="inline-block h-[6px] w-[6px] rounded-full bg-hub-success hub-pulse" />
                            <span className="font-medium text-white/80">
                                {currentTeam?.roleLabel ?? 'Member'}
                            </span>
                            <span className="text-white/30">·</span>
                            <span>{currentTeam?.name ?? ''}</span>
                        </div>
                    </div>
                </header>

                {/* Mobile content */}
                <main className="flex-1 overflow-y-auto bg-hub-surface">
                    {children}
                </main>

                {/* Mobile bottom nav — Sema-style */}
                <nav className="shrink-0 border-t border-hub-nav-border bg-hub-nav-bg hub-bottom-safe">
                    <div className="flex items-end justify-around px-1 pt-1.5 pb-0.5">
                        {tabs.map((tab) => {
                            const active = isActive(tab);

                            // Center FAB button
                            if (tab.isFab) {
                                return (
                                    <Link
                                        key={tab.name}
                                        href={tab.href}
                                        className="flex flex-col items-center"
                                    >
                                        <div
                                            className="-mt-5 flex h-[52px] w-[52px] items-center justify-center rounded-full border-[3px] border-hub-nav-bg text-white shadow-lg"
                                            style={{ background: primaryColor }}
                                        >
                                            <tab.icon className="h-5 w-5" strokeWidth={1.5} />
                                            {tab.badge && tab.badge > 0 && (
                                                <span className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-hub-danger text-[8px] font-bold text-white ring-2 ring-hub-nav-bg">
                                                    {tab.badge > 9 ? '9+' : tab.badge}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className="relative flex flex-col items-center gap-[3px] px-2 py-1.5"
                                >
                                    <div className="relative">
                                        <tab.icon
                                            className="h-5 w-5"
                                            strokeWidth={1.5}
                                            style={{ color: active ? primaryColor : 'var(--hub-text-faint)' }}
                                        />
                                        {tab.badge && tab.badge > 0 && (
                                            <span className="absolute -right-1.5 -top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-hub-danger text-[8px] font-bold text-white ring-2 ring-hub-nav-bg">
                                                {tab.badge > 9 ? '9+' : tab.badge}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className="text-[10px]"
                                        style={{ color: active ? primaryColor : 'var(--hub-text-faint)' }}
                                    >
                                        {tab.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
}

