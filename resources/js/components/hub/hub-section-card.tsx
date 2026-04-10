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
        <section className={cn('', className)}>
            {(title || subtitle || action) && (
                <div
                    className={cn(
                        'mb-[10px] flex items-center justify-between',
                        headerClassName,
                    )}
                >
                    <div className="min-w-0">
                        {title && (
                            <h2 className="text-[11px] font-medium uppercase tracking-[0.06em] text-hub-text-faint">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="mt-0.5 text-[11px] text-hub-text-faint">
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

