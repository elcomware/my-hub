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
    brand: 'bg-[#3A9828] text-white shadow-[0_14px_32px_rgba(58,152,40,0.22)]',
    dark: 'bg-[#252525] text-white shadow-[0_14px_30px_rgba(37,37,37,0.18)]',
    light: 'hub-surface text-[#2C2C2A]',
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
                'relative overflow-hidden rounded-[20px] p-4',
                variantClasses[variant],
                className,
            )}
        >
            <div className="pointer-events-none absolute -bottom-5 -right-5 h-20 w-20 rounded-full bg-[rgba(255,255,255,0.10)]" />
            <div className="pointer-events-none absolute -top-6 right-8 h-14 w-14 rounded-full bg-[rgba(255,255,255,0.06)]" />

            {eyebrow && (
                <p
                    className={cn(
                        'mb-1 text-[10px] font-medium uppercase tracking-[0.16em]',
                        isLight ? 'text-[#888780]' : 'text-white/65',
                    )}
                >
                    {eyebrow}
                </p>
            )}

            <h1
                className={cn(
                    'font-hub-serif text-[20px] font-semibold leading-[1.2]',
                    isLight ? 'text-[#2C2C2A]' : 'text-white',
                )}
            >
                {title}
            </h1>

            {description && (
                <p
                    className={cn(
                        'mt-2 text-[12px] leading-relaxed',
                        isLight ? 'text-[#6E6B66]' : 'text-white/80',
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

