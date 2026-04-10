import { Head, router, usePage } from '@inertiajs/react';
import { HubHeroCard } from '@/components/hub/hub-hero-card';
import { HubSectionCard } from '@/components/hub/hub-section-card';
import HubLayout from '@/layouts/hub-layout';

type Props = {
    connectedAppsCount: number;
};

function ProfileIndex({ connectedAppsCount }: Props) {
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

    const handleSignOut = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Profile" />
            <div className="px-3.5 py-3.5">
                <HubHeroCard
                    eyebrow="Your profile"
                    title={user.name}
                    description={`${teamRole.charAt(0).toUpperCase() + teamRole.slice(1)} · ${teamName}`}
                    variant="dark"
                    className="mb-4 text-center"
                    meta={
                        <div className="flex justify-center gap-2">
                            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium text-white/70">
                                Connected apps {connectedAppsCount}
                            </span>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium text-white/70">
                                Notifications on
                            </span>
                        </div>
                    }
                >
                    <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-full border-[2.5px] border-[#3A9828] bg-[#EBF7E6] text-lg font-bold text-[#3A9828]">
                        {initials}
                    </div>
                </HubHeroCard>

                <HubSectionCard title="Notifications" className="mb-4">
                    <div className="space-y-2">
                        <div className="rounded-[14px] bg-[#FBF8F4] px-3.5 py-3 dark:bg-neutral-950">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EBF7E6] text-sm">
                                        🔔
                                    </div>
                                    <span className="text-[13px] font-medium text-[#2C2C2A] dark:text-white">
                                        All notifications
                                    </span>
                                </div>
                                <div className="relative h-[18px] w-[34px] rounded-[9px] bg-[#3A9828]">
                                    <div className="absolute right-[3px] top-[3px] h-3 w-3 rounded-full bg-white" />
                                </div>
                            </div>
                        </div>
                        <div className="rounded-[14px] bg-[#FBF8F4] px-3.5 py-3 dark:bg-neutral-950">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F9EEF2] text-sm">
                                        ⚡
                                    </div>
                                    <span className="text-[13px] font-medium text-[#2C2C2A] dark:text-white">
                                        Urgent only
                                    </span>
                                </div>
                                <span className="text-xs text-[#888780]">›</span>
                            </div>
                        </div>
                    </div>
                </HubSectionCard>

                <HubSectionCard title="Account">
                    <div className="space-y-2">
                        <div className="rounded-[14px] bg-[#FBF8F4] px-3.5 py-3 dark:bg-neutral-950">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EBF7E6] text-sm">
                                        🔗
                                    </div>
                                    <span className="text-[13px] font-medium text-[#2C2C2A] dark:text-white">
                                        Connected apps ({connectedAppsCount})
                                    </span>
                                </div>
                                <span className="text-xs text-[#888780]">›</span>
                            </div>
                        </div>
                        <div className="rounded-[14px] bg-[#FBF8F4] px-3.5 py-3 dark:bg-neutral-950">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0F0F0] text-sm">
                                        🌍
                                    </div>
                                    <span className="text-[13px] font-medium text-[#2C2C2A] dark:text-white">
                                        Language
                                    </span>
                                </div>
                                <span className="text-xs text-[#888780]">English ›</span>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center justify-between rounded-[14px] bg-[#FBF8F4] px-3.5 py-3 dark:bg-neutral-950"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F9EEF2] text-sm">
                                    🚪
                                </div>
                                <span className="text-[13px] font-medium text-[#2C2C2A] dark:text-white">
                                    Sign out
                                </span>
                            </div>
                            <span className="text-xs text-[#8B1A3C]">›</span>
                        </button>
                    </div>
                </HubSectionCard>
            </div>
        </>
    );
}

ProfileIndex.layout = (page: React.ReactNode) => <HubLayout>{page}</HubLayout>;

export default ProfileIndex;

