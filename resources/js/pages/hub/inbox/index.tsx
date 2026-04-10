import { Head } from '@inertiajs/react';
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
            <div className="px-4 py-4">
                {/* Header */}
                <div className="mb-4">
                    <p className="font-hub-serif text-[20px] font-semibold text-hub-text">
                        Inbox
                    </p>
                    {totalUnread > 0 && (
                        <p className="mt-1 text-[12px] text-hub-text-muted">
                            {totalUnread} unread items
                        </p>
                    )}
                </div>

                {items.length > 0 ? (
                    <div className="flex flex-col gap-[9px]">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-[11px] rounded-[14px] border-[0.5px] border-hub-border bg-hub-surface-raised p-[13px]"
                            >
                                <div
                                    className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-lg"
                                    style={{ background: item.iconBg }}
                                >
                                    {item.icon}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex items-center justify-between gap-2">
                                        <span className="truncate text-[13px] font-medium text-hub-text">
                                            {item.from}
                                        </span>
                                        <span className="shrink-0 text-[11px] text-hub-text-faint">
                                            {item.time}
                                        </span>
                                    </div>
                                    <p className="truncate text-[13px] text-hub-text">
                                        {item.subject}
                                    </p>
                                    <p className="truncate text-[12px] text-hub-text-muted">
                                        {item.preview}
                                    </p>
                                </div>

                                {item.unreadCount && item.unreadCount > 0 && (
                                    <span className="mt-1 flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-hub-primary px-1 text-[10px] font-bold text-white">
                                        {item.unreadCount}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[14px] border-[0.5px] border-hub-border bg-hub-surface-raised p-10 text-center">
                        <p className="mb-2 text-2xl">📭</p>
                        <p className="text-[13px] font-medium text-hub-text">
                            All clear
                        </p>
                        <p className="mt-1 text-[12px] text-hub-text-faint">
                            Connected app notifications will appear here.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

InboxIndex.layout = (page: React.ReactNode) => <HubLayout>{page}</HubLayout>;

export default InboxIndex;

