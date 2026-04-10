import { Head, router, usePage, useForm } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import HubLayout from '@/layouts/hub-layout';

type NotifPref = { level: string; enabled: boolean };

type Props = {
    connectedAppsCount: number;
    notificationPreferences: Record<string, NotifPref>;
};

export function ConnectedAccountButton({ provider, connectedProviders }: { provider: string; connectedProviders: string[] }) {
    const isConnected = connectedProviders.includes(provider);
    const { post, processing } = useForm();
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
    const icon = provider === 'google' ? (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="mr-2"><g clipPath="url(#clip0_13183_10121)"><path d="M19.805 10.2308C19.805 9.55077 19.7492 8.86769 19.6308 8.20001H10.2V12.0492H15.6392C15.4108 13.2992 14.6525 14.3823 13.6058 15.0823V17.3392H16.605C18.405 15.6823 19.805 13.2308 19.805 10.2308Z" fill="#4285F4" /><path d="M10.2 20C12.7 20 14.805 19.1823 16.605 17.3392L13.6058 15.0823C12.6058 15.7823 11.4058 16.1823 10.2 16.1823C7.805 16.1823 5.805 14.5154 5.0725 12.3823H2.005V14.7154C3.795 17.9154 6.795 20 10.2 20Z" fill="#34A853" /><path d="M5.0725 12.3823C4.8725 11.6823 4.755 10.9323 4.755 10.1662C4.755 9.40001 4.8725 8.65001 5.0725 7.95001V5.61694H2.005C1.405 6.81694 1.055 8.16694 1.055 9.61694C1.055 11.0669 1.405 12.4169 2.005 13.6169L5.0725 12.3823Z" fill="#FBBC05" /><path d="M10.2 4.04923C11.5058 4.04923 12.7058 4.49923 13.6525 5.39923L16.6725 2.39923C14.8058 0.682308 12.7 0 10.2 0C6.795 0 3.795 2.08462 2.005 5.28462L5.0725 7.95001C5.805 5.81769 7.805 4.04923 10.2 4.04923Z" fill="#EA4335" /></g><defs><clipPath id="clip0_13183_10121"><rect width="20" height="20" fill="white" /></clipPath></defs></svg>
    ) : (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="mr-2"><path d="M10 0.25C4.615 0.25 0 4.865 0 10.25C0 14.7 2.865 18.4 6.84 19.65C7.34 19.74 7.52 19.44 7.52 19.18C7.52 18.95 7.51 18.3 7.51 17.5C5 18 4.38 16.62 4.38 16.62C3.93 15.5 3.27 15.2 3.27 15.2C2.32 14.57 3.34 14.58 3.34 14.58C4.38 14.66 4.92 15.65 4.92 15.65C5.86 17.22 7.34 16.78 7.89 16.54C7.98 15.81 8.27 15.32 8.6 15.07C6.67 14.82 4.67 14.01 4.67 10.99C4.67 10.13 4.98 9.43 5.5 8.87C5.41 8.62 5.13 7.77 5.59 6.65C5.59 6.65 6.24 6.41 7.5 7.19C8.11 7.03 8.77 6.95 9.43 6.95C10.09 6.95 10.75 7.03 11.36 7.19C12.62 6.41 13.27 6.65 13.27 6.65C13.73 7.77 13.45 8.62 13.36 8.87C13.88 9.43 14.19 10.13 14.19 10.99C14.19 14.02 12.19 14.81 10.26 15.06C10.68 15.39 11.05 16.07 11.05 17.09C11.05 18.5 11.04 19.7 11.04 19.18C11.04 19.44 11.22 19.75 11.73 19.65C15.7 18.4 18.56 14.7 18.56 10.25C18.56 4.865 13.945 0.25 10 0.25Z" fill="white" /></svg>
    );
    if (isConnected) {
        return (
            <form method="POST" action={`/auth/${provider}/disconnect`} onSubmit={e => { e.preventDefault(); post(`/auth/${provider}/disconnect`); }}>
                <button type="submit" className="w-full flex items-center justify-between rounded-lg border border-green-500 bg-green-50 px-3 py-2 text-green-700">
                    <span className="flex items-center">{icon} Connected to {providerName}</span>
                    <span className="ml-2 text-xs text-green-700">Disconnect</span>
                </button>
            </form>
        );
    }
    return (
        <a href={`/auth/${provider}/redirect`} className="w-full">
            <button type="button" className="w-full flex items-center rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900">
                {icon} Connect {providerName}
            </button>
        </a>
    );
}

function ProfileIndex({ connectedAppsCount, notificationPreferences }: Props) {
    const { auth, currentTeam, connectedProviders = [] } = usePage().props;
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
                {/* Connected Accounts — Sema style */}
                <div className="mb-4 overflow-hidden rounded-[14px] border-[0.5px] border-hub-border bg-hub-surface-raised">
                    <div className="flex items-center justify-between border-b border-hub-border/50 px-[14px] py-[13px]">
                        <div className="flex items-center gap-[10px]">
                            <span className="text-sm">🔗</span>
                            <p className="text-[14px] text-hub-text font-semibold">Connected Accounts</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 px-[14px] py-3">
                        <ConnectedAccountButton provider="google" connectedProviders={connectedProviders} />
                        <ConnectedAccountButton provider="github" connectedProviders={connectedProviders} />
                    </div>
                </div>
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

