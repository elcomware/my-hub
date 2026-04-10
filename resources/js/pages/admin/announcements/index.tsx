import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Announcement } from '@/types';

type Props = {
    announcements: {
        data: Announcement[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
};

type AnnouncementForm = {
    title: string;
    body: string;
    tag: string;
    is_draft: boolean;
};

export default function AdminAnnouncements({ announcements }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const form = useForm<AnnouncementForm>({
        title: '',
        body: '',
        tag: 'info',
        is_draft: true,
    });

    const resetForm = () => {
        form.reset();
        setEditingId(null);
        setShowForm(false);
    };

    const startEdit = (a: Announcement) => {
        form.setData({
            title: a.title,
            body: a.body,
            tag: a.tag,
            is_draft: a.isDraft ?? false,
        });
        setEditingId(a.id);
        setShowForm(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            form.patch(`/${teamSlug}/admin/announcements/${editingId}`, {
                onSuccess: () => resetForm(),
            });
        } else {
            form.post(`/${teamSlug}/admin/announcements`, {
                onSuccess: () => resetForm(),
            });
        }
    };

    const deleteAnnouncement = (id: number) => {
        if (confirm('Delete this announcement?')) {
            router.delete(`/${teamSlug}/admin/announcements/${id}`);
        }
    };

    const tagColors: Record<string, string> = {
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        event: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        operational: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    };

    return (
        <>
            <Head title="Manage Announcements" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Manage Announcements</h1>
                        <p className="text-sm text-muted-foreground">
                            Create and manage organisation announcements.
                        </p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                        <Plus className="h-4 w-4" />
                        New Announcement
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={submit} className="space-y-4 rounded-xl border p-4">
                        <h3 className="font-semibold">
                            {editingId ? 'Edit Announcement' : 'New Announcement'}
                        </h3>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Title *</label>
                            <input
                                type="text"
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Body *</label>
                            <textarea
                                value={form.data.body}
                                onChange={(e) => form.setData('body', e.target.value)}
                                rows={5}
                                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                required
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Tag</label>
                                <select
                                    value={form.data.tag}
                                    onChange={(e) => form.setData('tag', e.target.value)}
                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                                >
                                    <option value="info">Info</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="event">Event</option>
                                    <option value="operational">Operational</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_draft}
                                        onChange={(e) => form.setData('is_draft', e.target.checked)}
                                        id="is_draft"
                                        className="rounded"
                                    />
                                    <label htmlFor="is_draft" className="text-sm">
                                        Save as draft
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                            >
                                {editingId ? 'Update' : form.data.is_draft ? 'Save Draft' : 'Publish'}
                            </button>
                            <button type="button" onClick={resetForm} className="rounded-lg bg-muted px-4 py-2 text-sm font-medium">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">Title</th>
                                <th className="px-4 py-3 text-left font-medium">Tag</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Author</th>
                                <th className="px-4 py-3 text-left font-medium">Reads</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.data.map((a) => (
                                <tr key={a.id} className="border-b last:border-0">
                                    <td className="px-4 py-3 font-medium">{a.title}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagColors[a.tag] ?? ''}`}>
                                            {a.tag}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            a.isDraft
                                                ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        }`}>
                                            {a.isDraft ? 'Draft' : 'Published'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{a.authorName}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{a.readCount ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => startEdit(a)} className="rounded-md p-1.5 hover:bg-muted" title="Edit">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteAnnouncement(a.id)}
                                                className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {announcements.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No announcements yet.
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

