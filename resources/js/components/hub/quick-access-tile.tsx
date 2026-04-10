import type { HubApp } from '@/types';

type Props = {
    app: HubApp;
    onClick?: () => void;
    badge?: number;
};

const tileBgColors = [
    '#EBF4FD',
    '#EBF8EF',
    '#FEF9EC',
    '#F0EFFE',
    '#F9EEF2',
    '#EBF7E6',
    '#FEF0EB',
    '#F0F4FF',
];

const defaultTileBadges: Record<string, number> = {
    Slack: 5,
    Support: 3,
    Email: 6,
};

export function QuickAccessTile({ app, onClick, badge }: Props) {
    const bgColor = tileBgColors[(app.id ?? 0) % tileBgColors.length];
    const resolvedBadge = badge ?? defaultTileBadges[app.name];

    const handleClick = () => {
        onClick?.();

        if (app.isExternal) {
            window.open(app.url, '_blank', 'noopener,noreferrer');
        } else {
            window.location.href = app.url;
        }
    };

    return (
        <button
            onClick={handleClick}
            className="flex flex-col items-center gap-1.5 rounded-2xl p-1 outline-none transition-transform duration-150 hover:-translate-y-0.5"
        >
            <div
                className="relative flex h-[52px] w-[52px] items-center justify-center rounded-[17px] border border-[#ECE4DA] text-xl shadow-[0_6px_16px_rgba(37,37,37,0.06)]"
                style={{ background: bgColor }}
            >
                <span>{app.icon ?? '📱'}</span>
                {resolvedBadge && resolvedBadge > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-[9px] border-2 border-[#FBF8F4] bg-[#8B1A3C] px-0.5 text-[9px] font-bold text-white">
                        {resolvedBadge}
                    </span>
                )}
            </div>
            <span className="text-center text-[10px] font-medium leading-tight text-[#5F5E5A]">
                {app.name}
            </span>
        </button>
    );
}

