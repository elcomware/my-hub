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
            <div className="px-4 py-4">
                {/* Header */}
                <p className="mb-3 font-hub-serif text-[20px] font-semibold text-hub-text">
                    Apps
                </p>

                {/* Search — Sema-style with icon inside rounded box */}
                <div className="mb-4 flex items-center gap-[9px] rounded-[12px] border-[0.5px] border-hub-border bg-hub-surface-raised px-[13px] py-[10px]">
                    <Search className="h-[15px] w-[15px] shrink-0 text-hub-text-faint" />
                    <input
                        type="text"
                        placeholder={`Search ${apps.length} apps…`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent text-[14px] text-hub-text placeholder:text-hub-text-faint/60 outline-none"
                    />
                </div>

                {grouped.length > 0 ? (
                    grouped.map((group) => (
                        <HubSectionCard
                            key={group.category}
                            title={group.category}
                            subtitle={`${group.apps.length} tools`}
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
                            </div>
                        </HubSectionCard>
                    ))
                ) : (
                    <div className="rounded-[14px] border-[0.5px] border-hub-border bg-hub-surface-raised p-10 text-center">
                        <p className="mb-1 text-base">🔎</p>
                        <p className="text-sm text-hub-text-faint">No apps found.</p>
                    </div>
                )}
            </div>
        </>
    );
}

AppCatalog.layout = (page: React.ReactNode) => <HubLayout>{page}</HubLayout>;

export default AppCatalog;
