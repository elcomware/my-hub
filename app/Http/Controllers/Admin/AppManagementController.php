<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\TeamApp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AppManagementController extends Controller
{
    /**
     * Display the app management screen.
     */
    public function index(Request $request, Team $currentTeam): Response
    {
        Gate::authorize('manageApps', $currentTeam);

        $apps = $currentTeam->apps()
            ->with('category')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($app) => [
                'id' => $app->id,
                'name' => $app->name,
                'url' => $app->url,
                'icon' => $app->icon,
                'description' => $app->description,
                'isExternal' => $app->is_external,
                'categoryId' => $app->category_id,
                'category' => $app->category?->name,
                'visibilityRoles' => $app->visibility_roles,
                'sortOrder' => $app->sort_order,
            ]);

        $categories = $currentTeam->appCategories()
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'icon' => $cat->icon,
            ]);

        return Inertia::render('admin/apps/index', [
            'apps' => $apps,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a new app.
     */
    public function store(Request $request, Team $currentTeam): RedirectResponse
    {
        Gate::authorize('manageApps', $currentTeam);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:2048'],
            'icon' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'category_id' => ['nullable', 'exists:app_categories,id'],
            'visibility_roles' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_external' => ['boolean'],
        ]);

        $currentTeam->apps()->create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('App created.')]);

        return back();
    }

    /**
     * Update an existing app.
     */
    public function update(Request $request, Team $currentTeam, TeamApp $app): RedirectResponse
    {
        Gate::authorize('manageApps', $currentTeam);
        abort_if($app->team_id !== $currentTeam->id, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:2048'],
            'icon' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'category_id' => ['nullable', 'exists:app_categories,id'],
            'visibility_roles' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_external' => ['boolean'],
        ]);

        $app->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('App updated.')]);

        return back();
    }

    /**
     * Delete an app.
     */
    public function destroy(Request $request, Team $currentTeam, TeamApp $app): RedirectResponse
    {
        Gate::authorize('manageApps', $currentTeam);
        abort_if($app->team_id !== $currentTeam->id, 403);

        $app->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('App deleted.')]);

        return back();
    }
}
