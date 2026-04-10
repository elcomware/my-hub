import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { AppCategory, HubApp } from '@/types';

type Props = {
    apps: HubApp[];
    categories: AppCategory[];
};

type AppForm = {
    name: string;
    url: string;
    icon: string;
    description: string;
    category_id: number | string;
    visibility_roles: string[];
    sort_order: number;
    is_external: boolean;
};

export default function AdminApps({ apps, categories }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const form = useForm<AppForm>({
        name: '',
        url: '',
        icon: '',
        description: '',
        category_id: '',
        visibility_roles: [],
        sort_order: 0,
        is_external: true,
    });

    const resetForm = () => {
        form.reset();
        setEditingId(null);
        setShowForm(false);
    };

    const startEdit = (app: HubApp) => {
        form.setData({
            name: app.name,
            url: app.url,
            icon: app.icon ?? '',
            description: app.description ?? '',
            category_id: app.categoryId ?? '',
            visibility_roles: [],
            sort_order: 0,
            is_external: app.isExternal,
        });
        setEditingId(app.id);
        setShowForm(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            form.patch(`/${teamSlug}/admin/apps/${editingId}`, {
                onSuccess: () => resetForm(),
            });
        } else {
            form.post(`/${teamSlug}/admin/apps`, {
                onSuccess: () => resetForm(),
            });
        }
    };

    const deleteApp = (id: number) => {
        if (confirm('Delete this app?')) {
            router.delete(`/${teamSlug}/admin/apps/${id}`);
        }
    };

    return (
        <>
            <Head title="Manage Apps" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Manage Apps</h1>
                        <p className="text-sm text-muted-foreground">
                            Add, edit, and organise your organisation's app
                            catalog.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                        <Plus className="h-4 w-4" />
                        Add App
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <form
                        onSubmit={submit}
                        className="space-y-4 rounded-xl border p-4"
                    >
                        <h3 className="font-semibold">
                            {editingId ? 'Edit App' : 'New App'}
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    URL *
                                </label>
                                <input
                                    type="url"
                                    value={form.data.url}
                                    onChange={(e) =>
                                        form.setData('url', e.target.value)
                                    }
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Icon (emoji or name)
                                </label>
                                <input
                                    type="text"
                                    value={form.data.icon}
                                    onChange={(e) =>
                                        form.setData('icon', e.target.value)
                                    }
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Category
                                </label>
                                <select
                                    value={form.data.category_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'category_id',
                                            e.target.value
                                                ? Number(e.target.value)
                                                : '',
                                        )
                                    }
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">None</option>
                                    {categories.map((cat) => (
                                        <option
                                            key={cat.id}
                                            value={cat.id}
                                        >
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                rows={2}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.data.is_external}
                                onChange={(e) =>
                                    form.setData(
                                        'is_external',
                                        e.target.checked,
                                    )
                                }
                                id="is_external"
                                className="rounded"
                            />
                            <label
                                htmlFor="is_external"
                                className="text-sm"
                            >
                                External link (opens in new tab)
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                            >
                                {editingId ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg bg-muted px-4 py-2 text-sm font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* App List */}
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">
                                    App
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    URL
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {apps.map((app) => (
                                <tr
                                    key={app.id}
                                    className="border-b last:border-0"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">
                                                {app.icon ?? '📱'}
                                            </span>
                                            <span className="font-medium">
                                                {app.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {app.category ?? '—'}
                                    </td>
                                    <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                                        {app.url}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() =>
                                                    startEdit(app)
                                                }
                                                className="rounded-md p-1.5 hover:bg-muted"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteApp(app.id)
                                                }
                                                className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {apps.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No apps yet. Click "Add App" to
                                        get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

