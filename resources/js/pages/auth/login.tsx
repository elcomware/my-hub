import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';


type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};


export default function Login({ status, canResetPassword, canRegister }: Props) {
    return (
        <>
            <Head title="Log in" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-hub-surface to-hub-surface-raised py-12 px-4">
                <Card className="w-full max-w-md shadow-lg border-2 border-hub-border/60">
                    <CardHeader className="items-center">
                        <img src="/logo.svg" alt="LumaHub" className="mb-2 h-10 w-10" />
                        <CardTitle className="text-2xl font-serif tracking-tight">Sign in to LumaHub</CardTitle>
                        <div className="text-muted-foreground text-sm">Welcome back! Please log in to your account.</div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* OAuth Buttons */}
                        <div className="flex flex-col gap-3">
                            <a href="/auth/google/redirect" className="w-full">
                                <Button type="button" variant="outline" className="w-full flex items-center gap-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-900 shadow-sm">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_13183_10121)"><path d="M19.805 10.2308C19.805 9.55077 19.7492 8.86769 19.6308 8.20001H10.2V12.0492H15.6392C15.4108 13.2992 14.6525 14.3823 13.6058 15.0823V17.3392H16.605C18.405 15.6823 19.805 13.2308 19.805 10.2308Z" fill="#4285F4" /><path d="M10.2 20C12.7 20 14.805 19.1823 16.605 17.3392L13.6058 15.0823C12.6058 15.7823 11.4058 16.1823 10.2 16.1823C7.805 16.1823 5.805 14.5154 5.0725 12.3823H2.005V14.7154C3.795 17.9154 6.795 20 10.2 20Z" fill="#34A853" /><path d="M5.0725 12.3823C4.8725 11.6823 4.755 10.9323 4.755 10.1662C4.755 9.40001 4.8725 8.65001 5.0725 7.95001V5.61694H2.005C1.405 6.81694 1.055 8.16694 1.055 9.61694C1.055 11.0669 1.405 12.4169 2.005 13.6169L5.0725 12.3823Z" fill="#FBBC05" /><path d="M10.2 4.04923C11.5058 4.04923 12.7058 4.49923 13.6525 5.39923L16.6725 2.39923C14.8058 0.682308 12.7 0 10.2 0C6.795 0 3.795 2.08462 2.005 5.28462L5.0725 7.95001C5.805 5.81769 7.805 4.04923 10.2 4.04923Z" fill="#EA4335" /><path d="M19.805 10.2308C19.805 9.55077 19.7492 8.86769 19.6308 8.20001H10.2V12.0492H15.6392C15.4108 13.2992 14.6525 14.3823 13.6058 15.0823V17.3392H16.605C18.405 15.6823 19.805 13.2308 19.805 10.2308Z" fill="#4285F4" /><path d="M10.2 20C12.7 20 14.805 19.1823 16.605 17.3392L13.6058 15.0823C12.6058 15.7823 11.4058 16.1823 10.2 16.1823C7.805 16.1823 5.805 14.5154 5.0725 12.3823H2.005V14.7154C3.795 17.9154 6.795 20 10.2 20Z" fill="#34A853" /><path d="M5.0725 12.3823C4.8725 11.6823 4.755 10.9323 4.755 10.1662C4.755 9.40001 4.8725 8.65001 5.0725 7.95001V5.61694H2.005C1.405 6.81694 1.055 8.16694 1.055 9.61694C1.055 11.0669 1.405 12.4169 2.005 13.6169L5.0725 12.3823Z" fill="#FBBC05" /><path d="M10.2 4.04923C11.5058 4.04923 12.7058 4.49923 13.6525 5.39923L16.6725 2.39923C14.8058 0.682308 12.7 0 10.2 0C6.795 0 3.795 2.08462 2.005 5.28462L5.0725 7.95001C5.805 5.81769 7.805 4.04923 10.2 4.04923Z" fill="#EA4335" /></g><defs><clipPath id="clip0_13183_10121"><rect width="20" height="20" fill="white" /></clipPath></defs></svg>
                                    Continue with Google
                                </Button>
                            </a>
                            <a href="/auth/github/redirect" className="w-full">
                                <Button type="button" variant="outline" className="w-full flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-900 text-white shadow-sm">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 0.25C4.615 0.25 0 4.865 0 10.25C0 14.7 2.865 18.4 6.84 19.65C7.34 19.74 7.52 19.44 7.52 19.18C7.52 18.95 7.51 18.3 7.51 17.5C5 18 4.38 16.62 4.38 16.62C3.93 15.5 3.27 15.2 3.27 15.2C2.32 14.57 3.34 14.58 3.34 14.58C4.38 14.66 4.92 15.65 4.92 15.65C5.86 17.22 7.34 16.78 7.89 16.54C7.98 15.81 8.27 15.32 8.6 15.07C6.67 14.82 4.67 14.01 4.67 10.99C4.67 10.13 4.98 9.43 5.5 8.87C5.41 8.62 5.13 7.77 5.59 6.65C5.59 6.65 6.24 6.41 7.5 7.19C8.11 7.03 8.77 6.95 9.43 6.95C10.09 6.95 10.75 7.03 11.36 7.19C12.62 6.41 13.27 6.65 13.27 6.65C13.73 7.77 13.45 8.62 13.36 8.87C13.88 9.43 14.19 10.13 14.19 10.99C14.19 14.02 12.19 14.81 10.26 15.06C10.68 15.39 11.05 16.07 11.05 17.09C11.05 18.5 11.04 19.7 11.04 19.18C11.04 19.44 11.22 19.75 11.73 19.65C15.7 18.4 18.56 14.7 18.56 10.25C18.56 4.865 13.945 0.25 10 0.25Z" fill="white" /></svg>
                                    Continue with GitHub
                                </Button>
                            </a>
                        </div>
                        <div className="relative flex items-center py-2">
                            <span className="flex-grow border-t border-muted" />
                            <span className="mx-3 text-xs text-muted-foreground">or</span>
                            <span className="flex-grow border-t border-muted" />
                        </div>
                        {/* Email/password login */}
                        <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                            />
                                            <InputError message={errors.email} />
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                                {canResetPassword && (
                                                    <TextLink href={request()} className="ml-auto text-sm" tabIndex={5}>
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                            />
                                            <InputError message={errors.password} />
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="remember" name="remember" tabIndex={3} />
                                            <Label htmlFor="remember">Remember me</Label>
                                        </div>
                                        <Button type="submit" className="mt-2 w-full" tabIndex={4} disabled={processing} data-test="login-button">
                                            {processing && <Spinner />}
                                            Log in
                                        </Button>
                                    </div>
                                    {canRegister && (
                                        <div className="text-center text-sm text-muted-foreground">
                                            Don't have an account?{' '}
                                            <TextLink href={register()} tabIndex={5}>Sign up</TextLink>
                                        </div>
                                    )}
                                </>
                            )}
                        </Form>
                        {status && (
                            <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
