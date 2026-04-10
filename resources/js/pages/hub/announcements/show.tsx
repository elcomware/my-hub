import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import HubLayout from '@/layouts/hub-layout';
import type { Announcement } from '@/types';

type Props = {
    announcement: Announcement;
};

const tagStyles: Record<string, string> = {
    urgent: 'bg-[#F9EEF2] text-[#8B1A3C]',
    event: 'bg-[#EBF7E6] text-[#3A9828]',
    info: 'bg-[#E6F1FB] text-[#185FA5]',
    operational: 'bg-[#FEF3DC] text-[#A06B0A]',
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
                    className="mb-4 inline-flex items-center gap-1 rounded-full bg-[#F5F2ED] px-3 py-1.5 text-[11px] font-medium text-[#5F5E5A] hover:text-[#252525]"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Updates
                </Link>

                <article className="rounded-[20px] border border-[#E8E1D8] bg-white p-4 shadow-[0_6px_16px_rgba(37,37,37,0.04)] dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-3 flex items-center gap-2">
                        <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${tagClass}`}
                        >
                            {announcement.tag.charAt(0).toUpperCase() +
                                announcement.tag.slice(1)}
                        </span>
                        <span className="text-[10px] text-[#888780]">
                            {announcement.authorName} ·{' '}
                            {new Date(
                                announcement.publishedAt,
                            ).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="mb-3 font-serif text-[24px] font-semibold leading-[1.2] text-[#2C2C2A] dark:text-white">
                        {announcement.title}
                    </h1>

                    <div className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#5F5E5A] dark:text-neutral-400">
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
