import { Link } from '@inertiajs/react';
import type { Announcement } from '@/types';

const tagStyles: Record<string, { bg: string; text: string }> = {
    urgent: { bg: 'bg-[#FCEBEB]', text: 'text-[#A32D2D]' },
    event: { bg: 'bg-[#E1F5EE]', text: 'text-[#0F6E56]' },
    info: { bg: 'bg-[#FAEEDA]', text: 'text-[#633806]' },
    operational: { bg: 'bg-[#F5F2ED]', text: 'text-[#5F5E5A]' },
};

function getInitials(name: string): string {
    return name
        .split(/\s+/)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 2) return 'Yesterday';
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

type Props = {
    announcement: Announcement;
    teamSlug: string;
};

export function AnnouncementCard({ announcement: a, teamSlug }: Props) {
    const tag = tagStyles[a.tag] ?? tagStyles.info;

    return (
        <Link
            href={`/${teamSlug}/announcements/${a.id}`}
            className="block rounded-[14px] border-[0.5px] border-hub-border bg-hub-surface-raised p-[13px] transition-colors hover:border-hub-primary/30"
        >
            <div className="flex gap-[10px]">
                {/* Unread dot */}
                {a.isRead === false && (
                    <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-hub-primary" />
                )}

                <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-[1.45] text-hub-text">
                        {a.title}
                    </p>
                    {a.body && (
                        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-hub-text-muted">
                            {a.body}
                        </p>
                    )}
                    <div className="mt-[7px] flex items-center justify-between">
                        <div className="flex items-center gap-[6px]">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-[9px] py-[2px] text-[11px] font-medium ${tag.bg} ${tag.text}`}
                            >
                                {a.tag.charAt(0).toUpperCase() + a.tag.slice(1)}
                            </span>
                            <span className="text-[11px] text-hub-text-faint">
                                {a.authorName}
                            </span>
                        </div>
                        <span className="text-[11px] text-hub-text-faint">
                            {formatRelativeTime(a.publishedAt)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

