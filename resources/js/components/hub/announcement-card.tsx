import { Link } from '@inertiajs/react';
import type { Announcement } from '@/types';

const tagStyles: Record<string, { bg: string; text: string }> = {
    urgent: { bg: 'bg-[#F9EEF2]', text: 'text-[#8B1A3C]' },
    event: { bg: 'bg-[#EBF7E6]', text: 'text-[#3A9828]' },
    info: { bg: 'bg-[#E6F1FB]', text: 'text-[#185FA5]' },
    operational: { bg: 'bg-[#FEF3DC]', text: 'text-[#A06B0A]' },
};

const avatarStyles: Record<string, string> = {
    urgent: 'bg-[#F9EEF2] text-[#8B1A3C]',
    event: 'bg-[#EBF7E6] text-[#3A9828]',
    info: 'bg-[#E6F1FB] text-[#185FA5]',
    operational: 'bg-[#FEF3DC] text-[#A06B0A]',
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
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
        return 'Just now';
    }

    if (diffHours < 24) {
        return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return diffDays < 2
        ? 'Yesterday'
        : diffDays < 7
          ? date.toLocaleDateString([], { weekday: 'short' })
          : 'Last week';
}

type Props = {
    announcement: Announcement;
    teamSlug: string;
};

export function AnnouncementCard({ announcement: a, teamSlug }: Props) {
    const tag = tagStyles[a.tag] ?? tagStyles.info;
    const avatar = avatarStyles[a.tag] ?? avatarStyles.info;

    return (
        <Link
            href={`/${teamSlug}/announcements/${a.id}`}
            className="block rounded-[18px] border border-[#E8E1D8] bg-white p-3.5 shadow-[0_6px_16px_rgba(37,37,37,0.04)] transition-colors hover:border-[#C8DEC1] dark:border-neutral-800 dark:bg-neutral-900"
        >
            <div className="mb-2 flex items-center gap-2">
                <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatar}`}
                >
                    {getInitials(a.authorName)}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-[#2C2C2A] dark:text-white">
                        {a.authorName}
                    </p>
                    <p className="text-[10px] text-[#888780]">
                        {formatRelativeTime(a.publishedAt)}
                    </p>
                </div>
                <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${tag.bg} ${tag.text}`}
                >
                    {a.tag.charAt(0).toUpperCase() + a.tag.slice(1)}
                </span>
                {a.isRead === false && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#185FA5]" />
                )}
            </div>
            <p className="text-[13px] font-semibold leading-snug text-[#2C2C2A] dark:text-white">
                {a.title}
            </p>
            {a.body && (
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#6E6B66]">
                    {a.body}
                </p>
            )}
        </Link>
    );
}

