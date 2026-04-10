import { Form, Head, Link, usePage, useForm } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

export function ConnectedAccountButton({ provider, connectedProviders }: { provider: string; connectedProviders: string[] }) {
    const isConnected = connectedProviders.includes(provider);
    const { post, processing } = useForm();
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
    const icon = provider === 'google' ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-2"><g clipPath="url(#clip0_13183_10121)"><path d="M19.805 10.2308C19.805 9.55077 19.7492 8.86769 19.6308 8.20001H10.2V12.0492H15.6392C15.4108 13.2992 14.6525 14.3823 13.6058 15.0823V17.3392H16.605C18.405 15.6823 19.805 13.2308 19.805 10.2308Z" fill="#4285F4" /><path d="M10.2 20C12.7 20 14.805 19.1823 16.605 17.3392L13.6058 15.0823C12.6058 15.7823 11.4058 16.1823 10.2 16.1823C7.805 16.1823 5.805 14.5154 5.0725 12.3823H2.005V14.7154C3.795 17.9154 6.795 20 10.2 20Z" fill="#34A853" /><path d="M5.0725 12.3823C4.8725 11.6823 4.755 10.9323 4.755 10.1662C4.755 9.40001 4.8725 8.65001 5.0725 7.95001V5.61694H2.005C1.405 6.81694 1.055 8.16694 1.055 9.61694C1.055 11.0669 1.405 12.4169 2.005 13.6169L5.0725 12.3823Z" fill="#FBBC05" /><path d="M10.2 4.04923C11.5058 4.04923 12.7058 4.49923 13.6525 5.39923L16.6725 2.39923C14.8058 0.682308 12.7 0 10.2 0C6.795 0 3.795 2.08462 2.005 5.28462L5.0725 7.95001C5.805 5.81769 7.805 4.04923 10.2 4.04923Z" fill="#EA4335" /></g><defs><clipPath id="clip0_13183_10121"><rect width="20" height="20" fill="white" /></clipPath></defs></svg>
    ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-2"><path d="M10 0.25C4.615 0.25 0 4.865 0 10.25C0 14.7 2.865 18.4 6.84 19.65C7.34 19.74 7.52 19.44 7.52 19.18C7.52 18.95 7.51 18.3 7.51 17.5C5 18 4.38 16.62 4.38 16.62C3.93 15.5 3.27 15.2 3.27 15.2C2.32 14.57 3.34 14.58 3.34 14.58C4.38 14.66 4.92 15.65 4.92 15.65C5.86 17.22 7.34 16.78 7.89 16.54C7.98 15.81 8.27 15.32 8.6 15.07C6.67 14.82 4.67 14.01 4.67 10.99C4.67 10.13 4.98 9.43 5.5 8.87C5.41 8.62 5.13 7.77 5.59 6.65C5.59 6.65 6.24 6.41 7.5 7.19C8.11 7.03 8.77 6.95 9.43 6.95C10.09 6.95 10.75 7.03 11.36 7.19C12.62 6.41 13.27 6.65 13.27 6.65C13.73 7.77 13.45 8.62 13.36 8.87C13.88 9.43 14.19 10.13 14.19 10.99C14.19 14.02 12.19 14.81 10.26 15.06C10.68 15.39 11.05 16.07 11.05 17.09C11.05 18.5 11.04 19.7 11.04 19.18C11.04 19.44 11.22 19.75 11.73 19.65C15.7 18.4 18.56 14.7 18.56 10.25C18.56 4.865 13.945 0.25 10 0.25Z" fill="white" /></svg>
    );
    if (isConnected) {
        return (
            <form method="POST" action={`/auth/${provider}/disconnect`} onSubmit={e => { e.preventDefault(); post(`/auth/${provider}/disconnect`); }}>
                <Button type="submit" variant="outline" className="w-full flex items-center justify-between border-green-500 text-green-700 bg-green-50 hover:bg-green-100">
                    <span className="flex items-center">{icon} Connected to {providerName}</span>
                    <span className="ml-2 text-xs text-green-700">Disconnect</span>
                </Button>
            </form>
        );
    }
    return (
        <a href={`/auth/${provider}/redirect`} className="w-full">
            <Button type="button" variant="outline" className="w-full flex items-center">
                {icon} Connect {providerName}
            </Button>
        </a>
    );
}

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth, connectedProviders = [] } = usePage().props;

    return (
        <>
            <Head title="Profile settings" />
            <h1 className="sr-only">Profile settings</h1>
            <div className="space-y-6">
                {/* Connected Accounts */}
                <div className="rounded-xl border bg-card p-6">
                    <h2 className="mb-2 text-lg font-semibold">Connected Accounts</h2>
                    <div className="flex flex-col gap-3">
                        <ConnectedAccountButton provider="google" connectedProviders={connectedProviders} />
                        <ConnectedAccountButton provider="github" connectedProviders={connectedProviders} />
                    </div>
                </div>
                <Heading
                    variant="small"
                    title="Profile information"
                    description="Update your name and email address"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to resend the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has been
                                                    sent to your email address.
                                                </div>
                                            )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
