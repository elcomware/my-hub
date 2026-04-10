<?php

namespace App\Http\Middleware;

use App\Support\HubInbox;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $currentTeam = $user?->currentTeam;
        $unreadAnnouncementsCount = 0;
        $unreadInboxCount = 0;

        if ($user && $currentTeam) {
            $unreadAnnouncementsCount = $currentTeam->announcements()
                ->published()
                ->whereDoesntHave('readers', fn ($query) => $query->where('user_id', $user->id))
                ->count();

            $unreadInboxCount = HubInbox::unreadCountFor($currentTeam);
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'currentTeam' => fn () => $currentTeam ? $user->toUserTeam($currentTeam) : null,
            'teams' => fn () => $user?->toUserTeams(includeCurrent: true) ?? [],
            'hubBranding' => fn () => $currentTeam ? [
                'name' => $currentTeam->name,
                'logoPath' => $currentTeam->logo_path,
                'primaryColor' => $currentTeam->primary_color,
                'accentColor' => $currentTeam->accent_color,
                'description' => $currentTeam->description,
                'sector' => $currentTeam->sector,
            ] : null,
            'unreadAnnouncementsCount' => $unreadAnnouncementsCount,
            'unreadInboxCount' => $unreadInboxCount,
        ];
    }
}
