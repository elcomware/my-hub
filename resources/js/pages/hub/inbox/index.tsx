import { Head } from '@inertiajs/react';
import { HubHeroCard } from '@/components/hub/hub-hero-card';
import { HubSectionCard } from '@/components/hub/hub-section-card';
import HubLayout from '@/layouts/hub-layout';
import type { InboxItem } from '@/types';

type Props = {
    items: InboxItem[];
    totalUnread: number;
};

function InboxIndex({ items, totalUnread }: Props) {
    return (
        <>
            <Head title="Inbox" />
            <div className="px-3.5 py-3.5">
                <HubHeroCard
                    eyebrow="Unified inbox"
                    title="All messages in one place"
                    description={
                        totalUnread > 0
                            ? `${totalUnread} unread items are waiting.`
                            : 'Everything is triaged for now.'
                    }
                    className="mb-3.5"
                />

                <HubSectionCard>
                    {items.length > 0 ? (
                        <div className="space-y-2.5">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-2.5 rounded-[16px] border border-[#E8E1D8] bg-white p-3 shadow-[0_6px_16px_rgba(37,37,37,0.04)] dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    <div
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#ECE4DA] text-lg"
                                        style={{ background: item.iconBg }}
                                    >
                                        {item.icon}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-0.5 flex items-center justify-between gap-2">
                                            <span className="truncate text-xs font-semibold text-[#2C2C2A] dark:text-white">
                                                {item.from}
                                            </span>
                                            <span className="shrink-0 text-[10px] text-[#888780]">
                                                {item.time}
                                            </span>
                                        </div>
                                        <p className="truncate text-[12px] text-[#2C2C2A] dark:text-white">
                                            {item.subject}
                                        </p>
                                        <p className="truncate text-[11px] text-[#888780]">
                                            {item.preview}
                                        </p>
                                    </div>

                                    {item.unreadCount && item.unreadCount > 0 && (
                                        <span className="mt-0.5 flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-[9px] bg-[#3A9828] px-1 text-[10px] font-bold text-white">
                                            {item.unreadCount}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-5 text-center">
                            <p className="mb-1 text-base">📭</p>
                            <p className="text-sm text-[#888780]">
                                Your inbox is empty. Connected app notifications will appear here.
                            </p>
                        </div>
                    )}
                </HubSectionCard>
            </div>
        </>
    );
}

InboxIndex.layout = (page: React.ReactNode) => <HubLayout>{page}</HubLayout>;

export default InboxIndex;

