import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'brand' | 'dark' | 'light';

type Props = {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    children?: ReactNode;
    className?: string;
    variant?: Variant;
};

const variantClasses: Record<Variant, string> = {
    brand: 'bg-hub-primary text-white',
    dark: 'bg-hub-text text-white',
    light: 'hub-surface text-hub-text',
};

export function HubHeroCard({
    eyebrow,
    title,
    description,
    meta,
    children,
    className,
    variant = 'brand',
}: Props) {
    const isLight = variant === 'light';

    return (
        <section
            className={cn(
                'relative overflow-hidden rounded-[20px] p-[18px]',
                variantClasses[variant],
                className,
            )}
        >
            <div className="pointer-events-none absolute -bottom-5 -right-5 h-20 w-20 rounded-full bg-white/[0.08]" />
            <div className="pointer-events-none absolute -top-6 right-8 h-14 w-14 rounded-full bg-white/[0.05]" />

            {eyebrow && (
                <p
                    className={cn(
                        'mb-1 text-[10px] font-medium uppercase tracking-[0.08em]',
                        isLight ? 'text-hub-text-faint' : 'text-white/60',
                    )}
                >
                    {eyebrow}
                </p>
            )}

            <h1
                className={cn(
                    'font-hub-serif text-[18px] font-semibold leading-[1.25]',
                    isLight ? 'text-hub-text' : 'text-white',
                )}
            >
                {title}
            </h1>

            {description && (
                <p
                    className={cn(
                        'mt-2 text-[12px] leading-relaxed',
                        isLight ? 'text-hub-text-muted' : 'text-white/80',
                    )}
                >
                    {description}
                </p>
            )}

            {meta && <div className="mt-3">{meta}</div>}
            {children && <div className="mt-3">{children}</div>}
        </section>
    );
}

