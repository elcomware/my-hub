import { Head, useForm, usePage } from '@inertiajs/react';
import type { HubBranding } from '@/types';

type Props = {
    branding: HubBranding;
};

export default function AdminBranding({ branding }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';

    const form = useForm({
        primary_color: branding.primaryColor ?? '#1e293b',
        accent_color: branding.accentColor ?? '#3b82f6',
        description: branding.description ?? '',
        sector: branding.sector ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(`/${teamSlug}/admin/branding`);
    };

    return (
        <>
            <Head title="Branding Settings" />
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-xl font-bold">Branding Settings</h1>
                    <p className="text-sm text-muted-foreground">
                        Customise how your organisation's hub looks and feels.
                    </p>
                </div>

                {/* Preview */}
                <div
                    className="rounded-xl p-6 text-white"
                    style={{ backgroundColor: form.data.primary_color }}
                >
                    <h2 className="text-lg font-bold">{branding.name}</h2>
                    {form.data.description && (
                        <p className="mt-1 text-sm opacity-90">{form.data.description}</p>
                    )}
                    <div
                        className="mt-3 inline-block rounded-lg px-4 py-1.5 text-sm font-medium"
                        style={{ backgroundColor: form.data.accent_color }}
                    >
                        Accent Preview
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6 rounded-xl border p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Primary Colour
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={form.data.primary_color}
                                    onChange={(e) => form.setData('primary_color', e.target.value)}
                                    className="h-10 w-14 cursor-pointer rounded border"
                                />
                                <input
                                    type="text"
                                    value={form.data.primary_color}
                                    onChange={(e) => form.setData('primary_color', e.target.value)}
                                    className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
                                    pattern="^#[0-9A-Fa-f]{6}$"
                                />
                            </div>
                            {form.errors.primary_color && (
                                <p className="mt-1 text-xs text-red-500">{form.errors.primary_color}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Accent Colour
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={form.data.accent_color}
                                    onChange={(e) => form.setData('accent_color', e.target.value)}
                                    className="h-10 w-14 cursor-pointer rounded border"
                                />
                                <input
                                    type="text"
                                    value={form.data.accent_color}
                                    onChange={(e) => form.setData('accent_color', e.target.value)}
                                    className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
                                    pattern="^#[0-9A-Fa-f]{6}$"
                                />
                            </div>
                            {form.errors.accent_color && (
                                <p className="mt-1 text-xs text-red-500">{form.errors.accent_color}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Description</label>
                        <textarea
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                            placeholder="A short description of your organisation..."
                            maxLength={500}
                        />
                        {form.errors.description && (
                            <p className="mt-1 text-xs text-red-500">{form.errors.description}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Sector</label>
                        <input
                            type="text"
                            value={form.data.sector}
                            onChange={(e) => form.setData('sector', e.target.value)}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                            placeholder="e.g. Education, Healthcare, Finance..."
                            maxLength={100}
                        />
                        {form.errors.sector && (
                            <p className="mt-1 text-xs text-red-500">{form.errors.sector}</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                        >
                            Save Branding
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

