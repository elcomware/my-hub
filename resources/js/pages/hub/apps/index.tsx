import { Head, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { HubSectionCard } from '@/components/hub/hub-section-card';
import { QuickAccessTile } from '@/components/hub/quick-access-tile';
import HubLayout from '@/layouts/hub-layout';
import type { AppCategory, HubApp } from '@/types';

type Props = {
    apps: HubApp[];
    categories: AppCategory[];
    favouriteIds: number[];
};

function AppCatalog({ apps, categories }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search.trim()) {
            return apps;
        }

        const q = search.toLowerCase();

        return apps.filter((app) => app.name.toLowerCase().includes(q));
    }, [apps, search]);

    const grouped = useMemo(() => {
        const groups: { category: string; apps: HubApp[] }[] = [];
        const catMap = new Map<string, HubApp[]>();
        const uncategorized: HubApp[] = [];

        for (const app of filtered) {
            const catName = app.category ?? 'Other';

            if (!app.category) {
                uncategorized.push(app);
            } else {
                if (!catMap.has(catName)) {
                    catMap.set(catName, []);
                }

                catMap.get(catName)!.push(app);
            }
        }

        for (const cat of categories) {
            const catApps = catMap.get(cat.name);

            if (catApps && catApps.length > 0) {
                groups.push({ category: cat.name, apps: catApps });
            }
        }

        if (uncategorized.length > 0) {
            groups.push({ category: 'Other', apps: uncategorized });
        }

        return groups;
    }, [filtered, categories]);

    const recordLaunch = (appId: number) => {
        router.post(
            `/${teamSlug}/apps/${appId}/launch`,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="App Catalog" />
            <div className="px-3.5 py-3.5">
                <HubSectionCard className="mb-4">
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#888780]">
                        Discover tools
                    </p>
                    <div className="hub-muted-surface flex items-center gap-2 rounded-[14px] px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-950">
                        <Search className="h-3.5 w-3.5 shrink-0 text-[#888780]" />
                        <input
                            type="text"
                            placeholder="Search an app…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent text-xs text-[#2C2C2A] placeholder-[#888780] outline-none dark:text-white"
                        />
                    </div>
                </HubSectionCard>

                {grouped.length > 0 ? (
                    grouped.map((group, index) => (
                        <HubSectionCard
                            key={group.category}
                            title={group.category}
                            subtitle={`${group.apps.length} tools available`}
                            className="mb-4"
                        >
                            <div className="grid grid-cols-4 gap-2.5">
                                {group.apps.map((app) => (
                                    <QuickAccessTile
                                        key={app.id}
                                        app={app}
                                        onClick={() => recordLaunch(app.id)}
                                    />
                                ))}
                                {index === grouped.length - 1 && (
                                    <div className="flex flex-col items-center gap-1.5 rounded-2xl p-1 opacity-50">
                                        <div className="hub-muted-surface flex h-[52px] w-[52px] items-center justify-center rounded-[17px] text-sm shadow-[0_6px_16px_rgba(37,37,37,0.04)] dark:border-neutral-800 dark:bg-neutral-950">
                                            ➕
                                        </div>
                                        <span className="text-center text-[10px] font-medium leading-tight text-[#5F5E5A]">
                                            Add
                                        </span>
                                    </div>
                                )}
                            </div>
                        </HubSectionCard>
                    ))
                ) : (
                    <HubSectionCard className="p-10 text-center">
                        <p className="mb-1 text-base">🔎</p>
                        <p className="text-sm text-[#888780]">No apps found.</p>
                    </HubSectionCard>
                )}
            </div>
        </>
    );
}

AppCatalog.layout = (page: React.ReactNode) => <HubLayout>{page}</HubLayout>;

export default AppCatalog;
