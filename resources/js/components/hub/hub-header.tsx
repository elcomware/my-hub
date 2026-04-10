import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import type { HubBranding } from '@/types';

type Props = {
    branding: HubBranding;
    unreadCount?: number;
};

export function HubHeader({ branding, unreadCount = 0 }: Props) {
    const { auth, currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';
    const userName = auth.user.name.split(' ')[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const roleLabel = currentTeam?.roleLabel ?? 'Member';
    const supportingLabel = branding.sector ?? currentTeam?.name ?? 'Hub active';

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });

    return (
        <div
            className="relative overflow-hidden px-5 pb-5 pt-4"
            style={{ backgroundColor: branding.primaryColor ?? '#252525' }}
        >
            {/* Decorative circles */}
            <div
                className="pointer-events-none absolute -bottom-8 -right-5 h-[120px] w-[120px] rounded-full"
                style={{ background: 'rgba(61,152,40,0.12)' }}
            />
            <div
                className="pointer-events-none absolute -top-5 right-8 h-[70px] w-[70px] rounded-full"
                style={{ background: 'rgba(139,26,60,0.1)' }}
            />

            {/* Top row: Logo + Bell */}
            <div className="relative mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    {branding.logoPath ? (
                        <img
                            src={branding.logoPath}
                            alt={branding.name}
                            className="h-8 w-8 rounded-lg object-contain"
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3A9828] text-sm font-bold text-white">
                            {branding.name.charAt(0)}
                        </div>
                    )}
                    <div>
                        <p className="text-[13px] font-bold leading-tight text-white">
                            {branding.name}
                        </p>
                        {branding.description && (
                            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#82D36D]">
                                {branding.description.length > 30
                                    ? branding.description.slice(0, 30) + '…'
                                    : branding.description}
                            </p>
                        )}
                    </div>
                </div>

                <Link
                    href={`/${teamSlug}/inbox`}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:bg-white/20"
                >
                    <Bell className="h-4 w-4 text-white" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full border-[1.5px] border-[#252525] bg-[#EF9F27]" />
                    )}
                </Link>
            </div>

            {/* Greeting row */}
            <div className="relative flex items-end justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] text-white/50">{greeting}</p>
                    <p className="font-serif text-[25px] font-semibold leading-[1.1] tracking-tight text-white">
                        {userName}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-white/65">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#82D36D]" />
                        <span className="font-medium text-[#82D36D]">{roleLabel}</span>
                        <span className="text-white/25">•</span>
                        <span className="truncate">{supportingLabel}</span>
                    </div>
                </div>
                <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    {dateStr}
                </span>
            </div>
        </div>
    );
}

