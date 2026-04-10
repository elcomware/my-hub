<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    /**
     * Show the onboarding screen.
     */
    public function index(Request $request, Team $currentTeam): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->hasCompletedOnboarding()) {
            return redirect()->route('hub.index', $currentTeam);
        }

        return Inertia::render('hub/onboarding/index', [
            'teamName' => $currentTeam->name,
            'appCount' => $currentTeam->apps()->count(),
            'steps' => [
                ['key' => 'welcome', 'title' => 'Welcome to your hub', 'done' => true],
                ['key' => 'apps', 'title' => 'Discover your apps', 'done' => $currentTeam->apps()->count() > 0],
                ['key' => 'notifications', 'title' => 'Set up notifications', 'done' => false],
            ],
        ]);
    }

    /**
     * Mark onboarding as complete.
     */
    public function complete(Request $request, Team $currentTeam): RedirectResponse
    {
        $request->user()->update([
            'onboarding_completed_at' => now(),
        ]);

        return redirect()->route('hub.index', $currentTeam);
    }
}
