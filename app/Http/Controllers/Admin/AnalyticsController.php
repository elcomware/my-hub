<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    /**
     * Display the tenant analytics overview.
     */
    public function index(Request $request, Team $currentTeam): Response
    {
        $memberCount = $currentTeam->members()->count();

        $roleBreakdown = $currentTeam->memberships()
            ->select('role', DB::raw('count(*) as count'))
            ->groupBy('role')
            ->pluck('count', 'role')
            ->toArray();

        $appCount = $currentTeam->apps()->count();

        $appLaunches = DB::table('user_app_recents')
            ->join('team_apps', 'user_app_recents.app_id', '=', 'team_apps.id')
            ->where('team_apps.team_id', $currentTeam->id)
            ->count();

        $topApps = DB::table('user_app_recents')
            ->join('team_apps', 'user_app_recents.app_id', '=', 'team_apps.id')
            ->where('team_apps.team_id', $currentTeam->id)
            ->select('team_apps.name', 'team_apps.icon', DB::raw('count(*) as launches'))
            ->groupBy('team_apps.id', 'team_apps.name', 'team_apps.icon')
            ->orderByDesc('launches')
            ->limit(5)
            ->get()
            ->toArray();

        $announcementCount = $currentTeam->announcements()->published()->count();

        $announcementReadRate = 0;
        if ($announcementCount > 0 && $memberCount > 0) {
            $totalReads = DB::table('announcement_reads')
                ->join('announcements', 'announcement_reads.announcement_id', '=', 'announcements.id')
                ->where('announcements.team_id', $currentTeam->id)
                ->count();
            $announcementReadRate = round(($totalReads / ($announcementCount * $memberCount)) * 100);
        }

        $recentMembers = $currentTeam->members()
            ->orderByPivot('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($m) => [
                'name' => $m->name,
                'email' => $m->email,
                'role' => $m->pivot->role,
                'joinedAt' => $m->pivot->created_at->toISOString(),
            ]);

        $pendingInvitations = $currentTeam->invitations()
            ->whereNull('accepted_at')
            ->count();

        return Inertia::render('admin/analytics/index', [
            'stats' => [
                'memberCount' => $memberCount,
                'appCount' => $appCount,
                'appLaunches' => $appLaunches,
                'announcementCount' => $announcementCount,
                'announcementReadRate' => $announcementReadRate,
                'pendingInvitations' => $pendingInvitations,
            ],
            'roleBreakdown' => $roleBreakdown,
            'topApps' => $topApps,
            'recentMembers' => $recentMembers,
        ]);
    }
}
