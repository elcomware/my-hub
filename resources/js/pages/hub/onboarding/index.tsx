import { Head, router, usePage } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';
import HubLayout from '@/layouts/hub-layout';

type Step = { key: string; title: string; done: boolean };

type Props = {
    teamName: string;
    appCount: number;
    steps: Step[];
};

function OnboardingIndex({ teamName, appCount, steps }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';

    const complete = () => {
        router.post(`/${teamSlug}/onboarding/complete`);
    };

    return (
        <>
            <Head title="Get Started" />
            <div className="px-4 py-6">
                <div className="mb-6 text-center">
                    <p className="text-[32px]">👋</p>
                    <h1 className="mt-2 font-hub-serif text-[22px] font-semibold text-hub-text">
                        Welcome to {teamName}
                    </h1>
                    <p className="mt-1 text-[13px] text-hub-text-muted">
                        Let's get you set up in a few quick steps.
                    </p>
                </div>

                <div className="space-y-3">
                    {steps.map((step) => (
                        <div
                            key={step.key}
                            className="flex items-center gap-3 rounded-[14px] border-[0.5px] border-hub-border bg-hub-surface-raised px-4 py-[14px]"
                        >
                            <div
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${step.done
                                        ? 'bg-hub-success text-white'
                                        : 'border-[1.5px] border-hub-border bg-hub-surface'
                                    }`}
                            >
                                {step.done && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
                            </div>
                            <span
                                className={`text-[14px] ${step.done ? 'text-hub-text-muted line-through' : 'font-medium text-hub-text'
                                    }`}
                            >
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={() => router.visit(`/${teamSlug}/apps`)}
                        className="flex items-center justify-center gap-2 rounded-[12px] border-[0.5px] border-hub-border bg-hub-surface-raised px-4 py-3 text-[14px] font-medium text-hub-text transition-colors hover:bg-hub-surface"
                    >
                        Explore apps ({appCount})
                        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </button>

                    <button
                        onClick={complete}
                        className="rounded-[12px] bg-hub-primary px-4 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
                    >
                        I'm all set — go to hub
                    </button>
                </div>

                <p className="mt-4 text-center text-[11px] text-hub-text-faint/60">
                    You can always revisit settings from your profile.
                </p>
            </div>
        </>
    );
}

OnboardingIndex.layout = (page: React.ReactNode) => <HubLayout>{page}</HubLayout>;

export default OnboardingIndex;
