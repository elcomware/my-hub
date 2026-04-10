<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the team dashboard.
     */
    public function index(Request $request, Team $currentTeam): Response
    {
        $user = $request->user();

        $memberCount = $currentTeam->members()->count();
        $appCount = $currentTeam->apps()->count();

        $unreadAnnouncements = $currentTeam->announcements()
            ->published()
            ->whereDoesntHave('readers', fn ($q) => $q->where('user_id', $user->id))
            ->count();

        $recentAnnouncements = $currentTeam->announcements()
            ->published()
            ->with('author:id,name')
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'tag' => $a->tag,
                'authorName' => $a->author->name,
                'publishedAt' => $a->published_at->toISOString(),
            ]);

        $pendingInvitations = $currentTeam->invitations()
            ->whereNull('accepted_at')
            ->count();

        $teamRole = $user->teamRole($currentTeam)?->value ?? 'member';

        return Inertia::render('dashboard', [
            'stats' => [
                'memberCount' => $memberCount,
                'appCount' => $appCount,
                'unreadAnnouncements' => $unreadAnnouncements,
                'pendingInvitations' => $pendingInvitations,
            ],
            'recentAnnouncements' => $recentAnnouncements,
            'teamRole' => $teamRole,
        ]);
    }
}
