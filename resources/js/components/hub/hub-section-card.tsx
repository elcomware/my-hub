import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    title?: ReactNode;
    subtitle?: ReactNode;
    action?: ReactNode;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    children: ReactNode;
};

export function HubSectionCard({
    title,
    subtitle,
    action,
    className,
    headerClassName,
    contentClassName,
    children,
}: Props) {
    return (
        <section
            className={cn(
                'hub-surface rounded-[18px] p-3 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none',
                className,
            )}
        >
            {(title || subtitle || action) && (
                <div
                    className={cn(
                        'mb-3 flex items-start justify-between gap-3',
                        headerClassName,
                    )}
                >
                    <div className="min-w-0">
                        {title && (
                            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#5F5E5A] dark:text-white">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="mt-1 text-[11px] text-[#888780] dark:text-neutral-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
            <div className={cn('', contentClassName)}>{children}</div>
        </section>
    );
}

