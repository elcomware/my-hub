<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementFeedController extends Controller
{
    /**
     * Display the announcements feed.
     */
    public function index(Request $request, Team $currentTeam): Response
    {
        $user = $request->user();

        $announcements = $currentTeam->announcements()
            ->published()
            ->with('author:id,name')
            ->latest('published_at')
            ->paginate(15)
            ->through(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'body' => str($a->body)->limit(200)->toString(),
                'tag' => $a->tag,
                'authorName' => $a->author->name,
                'publishedAt' => $a->published_at->toISOString(),
                'isRead' => $a->readers()->where('user_id', $user->id)->exists(),
            ]);

        $unreadCount = $currentTeam->announcements()
            ->published()
            ->whereDoesntHave('readers', fn ($q) => $q->where('user_id', $user->id))
            ->count();

        return Inertia::render('hub/announcements/index', [
            'announcements' => $announcements,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Display a single announcement.
     */
    public function show(Request $request, Team $currentTeam, Announcement $announcement): Response
    {
        abort_if($announcement->team_id !== $currentTeam->id, 403);
        abort_if(! $announcement->isPublished(), 404);

        $user = $request->user();

        // Mark as read
        $announcement->readers()->syncWithoutDetaching([
            $user->id => ['read_at' => now()],
        ]);

        return Inertia::render('hub/announcements/show', [
            'announcement' => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'body' => $announcement->body,
                'tag' => $announcement->tag,
                'authorName' => $announcement->author->name,
                'publishedAt' => $announcement->published_at->toISOString(),
                'createdAt' => $announcement->created_at->toISOString(),
            ],
        ]);
    }

    /**
     * Mark all announcements as read.
     */
    public function markAllRead(Request $request, Team $currentTeam): RedirectResponse
    {
        $user = $request->user();

        $unreadIds = $currentTeam->announcements()
            ->published()
            ->whereDoesntHave('readers', fn ($q) => $q->where('user_id', $user->id))
            ->pluck('id');

        $records = $unreadIds->mapWithKeys(fn ($id) => [$id => ['read_at' => now()]])->toArray();
        $user->load([]); // avoid lazy loading issues

        \DB::table('announcement_reads')->insert(
            $unreadIds->map(fn ($id) => [
                'user_id' => $user->id,
                'announcement_id' => $id,
                'read_at' => now(),
            ])->toArray()
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('All announcements marked as read.')]);

        return back();
    }
}
