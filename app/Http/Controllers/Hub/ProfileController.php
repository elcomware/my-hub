<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the hub profile page.
     */
    public function index(Request $request, Team $currentTeam): Response
    {
        $user = $request->user();

        $preferences = $user->notificationPreferences()
            ->where('team_id', $currentTeam->id)
            ->get()
            ->keyBy('channel')
            ->map(fn ($pref) => [
                'level' => $pref->level,
                'enabled' => $pref->enabled,
            ]);

        // Ensure defaults exist for display
        $defaults = collect(['web', 'push', 'email'])->mapWithKeys(fn ($ch) => [
            $ch => $preferences->get($ch, ['level' => 'all', 'enabled' => true]),
        ]);

        return Inertia::render('hub/profile/index', [
            'connectedAppsCount' => $currentTeam->apps()->count(),
            'notificationPreferences' => $defaults,
            'connectedProviders' => $user->connectedProviders(),
        ]);
    }

    /**
     * Update notification preferences for the current team.
     */
    public function updateNotificationPreferences(Request $request, Team $currentTeam): RedirectResponse
    {
        $validated = $request->validate([
            'channel' => ['required', 'string', 'in:web,push,email'],
            'level' => ['sometimes', 'string', 'in:all,urgent,none'],
            'enabled' => ['sometimes', 'boolean'],
        ]);

        $request->user()->notificationPreferences()->updateOrCreate(
            [
                'team_id' => $currentTeam->id,
                'channel' => $validated['channel'],
            ],
            collect($validated)->only(['level', 'enabled'])->toArray(),
        );

        return back();
    }
}

