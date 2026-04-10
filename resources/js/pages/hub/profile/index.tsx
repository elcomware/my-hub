import { Head, router, usePage } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import HubLayout from '@/layouts/hub-layout';

type NotifPref = { level: string; enabled: boolean };

type Props = {
    connectedAppsCount: number;
    notificationPreferences: Record<string, NotifPref>;
};

function ProfileIndex({ connectedAppsCount, notificationPreferences }: Props) {
    const { auth, currentTeam } = usePage().props;
    const user = auth.user;

    const initials = user.name
        .split(/\s+/)
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const teamRole = currentTeam?.role ?? 'member';
    const teamName = currentTeam?.name ?? '';
    const teamSlug = currentTeam?.slug ?? '';

    const webPref = notificationPreferences.web ?? { level: 'all', enabled: true };
    const notifsEnabled = webPref.enabled;
    const isUrgentOnly = webPref.level === 'urgent';

    const toggleNotifications = () => {
        router.post(`/${teamSlug}/profile/notification-preferences`, {
            channel: 'web',
            enabled: !notifsEnabled,
        }, { preserveScroll: true });
    };

    const toggleUrgentOnly = () => {
        router.post(`/${teamSlug}/profile/notification-preferences`, {
            channel: 'web',
            level: isUrgentOnly ? 'all' : 'urgent',
        }, { preserveScroll: true });
    };

    const handleSignOut = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Profile" />
            <div className="px-4 py-4">
                {/* Profile header — Sema-style */}
                <div className="mb-4 border-b border-hub-border pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-[13px]">
                            <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-hub-primary font-hub-serif text-[20px] font-semibold text-white">
                                {initials}
                            </div>
                            <div>
                                <p className="font-hub-serif text-[18px] font-semibold text-hub-text">
                                    {user.name}
                                </p>
                                <span className="inline-flex items-center gap-1 rounded-full bg-hub-success/10 px-[9px] py-[2px] text-[11px] font-medium text-hub-success">
                                    {teamRole.charAt(0).toUpperCase() + teamRole.slice(1)}
                                </span>
                                <p className="mt-1 text-[11px] text-hub-text-faint">
                                    {teamName}
                                </p>
                            </div>
                        </div>
                        <button className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-hub-surface text-hub-text-muted">
                            <Settings className="h-[17px] w-[17px]" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* Stats row */}
                <div className="mb-4 grid grid-cols-3 gap-2">
                    <div className="rounded-[12px] border-[0.5px] border-hub-border bg-hub-surface-raised p-[11px] text-center">
                        <p className="font-hub-serif text-[22px] font-semibold text-hub-text">
                            {connectedAppsCount}
                        </p>
                        <p className="text-[10px] text-hub-text-faint">connected apps</p>
                    </div>
                    <div className="rounded-[12px] border-[0.5px] border-hub-border bg-hub-surface-raised p-[11px] text-center">
                        <p className="font-hub-serif text-[22px] font-semibold text-hub-success">
                            ✓
                        </p>
                        <p className="text-[10px] text-hub-text-faint">verified</p>
                    </div>
                    <div className="rounded-[12px] border-[0.5px] border-hub-border bg-hub-primary/10 p-[11px] text-center">
                        <p className="font-hub-serif text-[22px] font-semibold text-hub-primary">
                            {notifsEnabled ? 'on' : 'off'}
                        </p>
                        <p className="text-[10px] text-hub-text-faint">notifications</p>
                    </div>
                </div>

                {/* Settings list — Sema card style */}
                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.06em] text-hub-text-faint">
                    Notifications
                </p>
                <div className="mb-4 overflow-hidden rounded-[14px] border-[0.5px] border-hub-border bg-hub-surface-raised">
                    <button onClick={toggleNotifications} className="flex w-full items-center justify-between border-b border-hub-border/50 px-[14px] py-[13px]">
                        <p className="text-[14px] text-hub-text">All notifications</p>
                        <div className={`relative h-[20px] w-[36px] rounded-[10px] transition-colors ${notifsEnabled ? 'bg-hub-primary' : 'bg-hub-border'}`}>
                            <div className={`absolute top-[2px] h-4 w-4 rounded-full bg-white transition-all ${notifsEnabled ? 'right-[2px]' : 'left-[2px]'}`} />
                        </div>
                    </button>
                    <button onClick={toggleUrgentOnly} className="flex w-full items-center justify-between px-[14px] py-[13px]">
                        <p className="text-[14px] text-hub-text">Urgent only</p>
                        <div className={`relative h-[20px] w-[36px] rounded-[10px] transition-colors ${isUrgentOnly ? 'bg-hub-primary' : 'bg-hub-border'}`}>
                            <div className={`absolute top-[2px] h-4 w-4 rounded-full bg-white transition-all ${isUrgentOnly ? 'right-[2px]' : 'left-[2px]'}`} />
                        </div>
                    </button>
                </div>

                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.06em] text-hub-text-faint">
                    Account
                </p>
                <div className="mb-4 overflow-hidden rounded-[14px] border-[0.5px] border-hub-border bg-hub-surface-raised">
                    <div className="flex items-center justify-between border-b border-hub-border/50 px-[14px] py-[13px]">
                        <div className="flex items-center gap-[10px]">
                            <span className="text-sm">🔗</span>
                            <p className="text-[14px] text-hub-text">
                                Connected apps ({connectedAppsCount})
                            </p>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-hub-text-faint">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                    <div className="flex items-center justify-between border-b border-hub-border/50 px-[14px] py-[13px]">
                        <div className="flex items-center gap-[10px]">
                            <span className="text-sm">🌍</span>
                            <p className="text-[14px] text-hub-text">Language</p>
                        </div>
                        <span className="text-[12px] text-hub-text-faint">English ›</span>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex w-full items-center justify-between px-[14px] py-[13px]"
                    >
                        <div className="flex items-center gap-[10px]">
                            <span className="text-sm">🚪</span>
                            <p className="text-[14px] text-hub-text">Sign out</p>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-hub-danger">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>

                <p className="text-center text-[11px] text-hub-text-faint/50">
                    LumaHub · {teamName}
                </p>
            </div>
        </>
    );
}

ProfileIndex.layout = (page: React.ReactNode) => <HubLayout>{page}</HubLayout>;

export default ProfileIndex;

