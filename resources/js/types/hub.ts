export type AppCategory = {
    id: number;
    name: string;
    icon?: string | null;
};

export type HubApp = {
    id: number;
    name: string;
    url: string;
    icon?: string | null;
    description?: string | null;
    isExternal: boolean;
    categoryId?: number | null;
    category?: string | null;
};

export type Announcement = {
    id: number;
    title: string;
    body: string;
    tag: 'info' | 'urgent' | 'event' | 'operational';
    authorName: string;
    publishedAt: string;
    createdAt?: string;
    isRead?: boolean;
    isDraft?: boolean;
    readCount?: number;
};

export type HubBranding = {
    name: string;
    logoPath?: string | null;
    primaryColor?: string | null;
    accentColor?: string | null;
    description?: string | null;
    sector?: string | null;
};

export type HubStats = {
    totalApps: number;
    totalMembers: number;
    unreadAnnouncements: number;
    newUpdates: number;
    upcomingEvents: number;
};

export type InboxItem = {
    id: number;
    icon: string;
    iconBg: string;
    from: string;
    time: string;
    subject: string;
    preview: string;
    unreadCount?: number;
};

