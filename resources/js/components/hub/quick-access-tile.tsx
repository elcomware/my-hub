import type { HubApp } from '@/types';

type Props = {
    app: HubApp;
    onClick?: () => void;
    badge?: number;
};

const tileBgColors = [
    '#FAECE7',
    '#E1F5EE',
    '#FAEEDA',
    '#F0EFFE',
    '#F5F2ED',
    '#EBF4FD',
    '#FEF0EB',
    '#F0F4FF',
];

export function QuickAccessTile({ app, onClick, badge }: Props) {
    const bgColor = tileBgColors[(app.id ?? 0) % tileBgColors.length];

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
            className="flex flex-col items-center gap-1.5 rounded-2xl p-1 outline-none transition-transform duration-150 hover:-translate-y-0.5 active:scale-95"
        >
            <div
                className="relative flex h-[52px] w-[52px] items-center justify-center rounded-[17px] border-[0.5px] border-hub-border text-xl"
                style={{ background: bgColor }}
            >
                <span>{app.icon ?? '📱'}</span>
                {badge && badge > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-hub-danger text-[8px] font-bold text-white ring-2 ring-hub-surface">
                        {badge > 9 ? '9+' : badge}
                    </span>
                )}
            </div>
            <span className="text-center text-[10px] font-medium leading-tight text-hub-text-muted">
                {app.name}
            </span>
        </button>
    );
}

