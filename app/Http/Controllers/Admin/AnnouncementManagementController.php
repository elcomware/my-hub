<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementManagementController extends Controller
{
    /**
     * Display the announcement management screen.
     */
    public function index(Request $request, Team $currentTeam): Response
    {
        Gate::authorize('manageAnnouncements', $currentTeam);

        $announcements = $currentTeam->announcements()
            ->with('author:id,name')
            ->latest()
            ->paginate(20)
            ->through(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'tag' => $a->tag,
                'isDraft' => $a->is_draft,
                'authorName' => $a->author->name,
                'publishedAt' => $a->published_at?->toISOString(),
                'createdAt' => $a->created_at->toISOString(),
                'readCount' => $a->readers()->count(),
            ]);

        return Inertia::render('admin/announcements/index', [
            'announcements' => $announcements,
        ]);
    }

    /**
     * Store a new announcement.
     */
    public function store(Request $request, Team $currentTeam): RedirectResponse
    {
        Gate::authorize('manageAnnouncements', $currentTeam);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:10000'],
            'tag' => ['required', 'string', 'in:info,urgent,event,operational'],
            'target_audiences' => ['nullable', 'array'],
            'is_draft' => ['boolean'],
        ]);

        $validated['author_id'] = $request->user()->id;

        if (! ($validated['is_draft'] ?? true)) {
            $validated['published_at'] = now();
        }

        $currentTeam->announcements()->create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Announcement created.')]);

        return back();
    }

    /**
     * Update an existing announcement.
     */
    public function update(Request $request, Team $currentTeam, Announcement $announcement): RedirectResponse
    {
        Gate::authorize('manageAnnouncements', $currentTeam);
        abort_if($announcement->team_id !== $currentTeam->id, 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:10000'],
            'tag' => ['required', 'string', 'in:info,urgent,event,operational'],
            'target_audiences' => ['nullable', 'array'],
            'is_draft' => ['boolean'],
        ]);

        // Publish if transitioning from draft to published
        if (! ($validated['is_draft'] ?? true) && $announcement->is_draft) {
            $validated['published_at'] = now();
        }

        $announcement->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Announcement updated.')]);

        return back();
    }

    /**
     * Delete an announcement.
     */
    public function destroy(Request $request, Team $currentTeam, Announcement $announcement): RedirectResponse
    {
        Gate::authorize('manageAnnouncements', $currentTeam);
        abort_if($announcement->team_id !== $currentTeam->id, 403);

        $announcement->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Announcement deleted.')]);

        return back();
    }
}
