import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import HubLayout from '@/layouts/hub-layout';
import type { Announcement } from '@/types';

type Props = {
    announcement: Announcement;
};

const tagStyles: Record<string, string> = {
    urgent: 'bg-[#FCEBEB] text-[#A32D2D]',
    event: 'bg-[#E1F5EE] text-[#0F6E56]',
    info: 'bg-[#FAEEDA] text-[#633806]',
    operational: 'bg-[#F5F2ED] text-[#5F5E5A]',
};

function AnnouncementShow({ announcement }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';

    const tagClass = tagStyles[announcement.tag] ?? tagStyles.info;

    return (
        <>
            <Head title={announcement.title} />
            <div className="px-3.5 py-3.5">
                <Link
                    href={`/${teamSlug}/announcements`}
                    className="mb-4 inline-flex items-center gap-1 rounded-full bg-hub-surface px-3 py-1.5 text-[11px] font-medium text-hub-text-faint hover:text-hub-text"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Updates
                </Link>

                <article className="rounded-[14px] border-[0.5px] border-hub-border bg-hub-surface-raised p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${tagClass}`}
                        >
                            {announcement.tag.charAt(0).toUpperCase() +
                                announcement.tag.slice(1)}
                        </span>
                        <span className="text-[10px] text-hub-text-faint">
                            {announcement.authorName} ·{' '}
                            {new Date(
                                announcement.publishedAt,
                            ).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="mb-3 font-hub-serif text-[24px] font-semibold leading-[1.2] text-hub-text">
                        {announcement.title}
                    </h1>

                    <div className="whitespace-pre-wrap text-[13px] leading-relaxed text-hub-text-muted">
                        {announcement.body}
                    </div>
                </article>
            </div>
        </>
    );
}

AnnouncementShow.layout = (page: React.ReactNode) => (
    <HubLayout>{page}</HubLayout>
);

export default AnnouncementShow;
