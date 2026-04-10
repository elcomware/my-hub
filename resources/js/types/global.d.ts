import type { Auth, HubBranding } from '@/types';
import type { Team } from '@/types/teams';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            currentTeam: Team | null;
            teams: Team[];
            hubBranding: HubBranding | null;
            unreadAnnouncementsCount: number;
            unreadInboxCount: number;
            [key: string]: unknown;
        };
    }
}
