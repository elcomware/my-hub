<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HubController extends Controller
{
    /**
     * Display the hub home page.
     */
    public function index(Request $request, Team $currentTeam): Response
    {
        $user = $request->user();

        $pinnedApps = $user->favouriteApps()
            ->where('team_id', $currentTeam->id)
            ->with('category')
            ->orderBy('sort_order')
            ->limit(7)
            ->get()
            ->map(fn ($app) => [
                'id' => $app->id,
                'name' => $app->name,
                'url' => $app->url,
                'icon' => $app->icon,
                'description' => $app->description,
                'isExternal' => $app->is_external,
                'category' => $app->category?->name,
            ]);

        $recentAnnouncements = $currentTeam->announcements()
            ->published()
            ->with('author:id,name')
            ->latest('published_at')
            ->limit(5)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'body' => str($a->body)->limit(120)->toString(),
                'tag' => $a->tag,
                'authorName' => $a->author->name,
                'publishedAt' => $a->published_at->toISOString(),
                'isRead' => $a->readers()->where('user_id', $user->id)->exists(),
            ]);

        $unreadAnnouncements = $currentTeam->announcements()
            ->published()
            ->whereDoesntHave('readers', fn ($q) => $q->where('user_id', $user->id))
            ->count();

        $newUpdates = $currentTeam->announcements()
            ->published()
            ->where('published_at', '>=', now()->subDays(7))
            ->count();

        $upcomingEvents = $currentTeam->announcements()
            ->published()
            ->where('tag', 'event')
            ->where('published_at', '>=', now()->subDays(30))
            ->count();

        $stats = [
            'totalApps' => $currentTeam->apps()->count(),
            'totalMembers' => $currentTeam->members()->count(),
            'unreadAnnouncements' => $unreadAnnouncements,
            'newUpdates' => $newUpdates,
            'upcomingEvents' => $upcomingEvents,
        ];

        return Inertia::render('hub/index', [
            'pinnedApps' => $pinnedApps,
            'recentAnnouncements' => $recentAnnouncements,
            'stats' => $stats,
            'branding' => [
                'name' => $currentTeam->name,
                'logoPath' => $currentTeam->logo_path,
                'primaryColor' => $currentTeam->primary_color,
                'accentColor' => $currentTeam->accent_color,
                'description' => $currentTeam->description,
            ],
        ]);
    }
}
