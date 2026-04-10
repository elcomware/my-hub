<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\TeamApp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppCatalogController extends Controller
{
    /**
     * Display the app catalog.
     */
    public function index(Request $request, Team $currentTeam): Response
    {
        $user = $request->user();
        $userRole = $user->teamRole($currentTeam)?->value;

        $categories = $currentTeam->appCategories()
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'icon' => $cat->icon,
            ]);

        $apps = $currentTeam->apps()
            ->with('category')
            ->orderBy('category_id')
            ->orderBy('sort_order')
            ->get()
            ->filter(function ($app) use ($userRole) {
                if (empty($app->visibility_roles)) {
                    return true;
                }

                return in_array($userRole, $app->visibility_roles);
            })
            ->values()
            ->map(fn ($app) => [
                'id' => $app->id,
                'name' => $app->name,
                'url' => $app->url,
                'icon' => $app->icon,
                'description' => $app->description,
                'isExternal' => $app->is_external,
                'categoryId' => $app->category_id,
                'category' => $app->category?->name,
            ]);

        $favouriteIds = $user->favouriteApps()
            ->where('team_id', $currentTeam->id)
            ->pluck('team_apps.id')
            ->toArray();

        return Inertia::render('hub/apps/index', [
            'apps' => $apps,
            'categories' => $categories,
            'favouriteIds' => $favouriteIds,
        ]);
    }

    /**
     * Toggle favourite status for an app.
     */
    public function toggleFavourite(Request $request, Team $currentTeam, TeamApp $app): JsonResponse
    {
        abort_if($app->team_id !== $currentTeam->id, 403);

        $user = $request->user();

        if ($user->favouriteApps()->where('app_id', $app->id)->exists()) {
            $user->favouriteApps()->detach($app->id);
            $isFavourite = false;
        } else {
            $user->favouriteApps()->attach($app->id);
            $isFavourite = true;
        }

        return response()->json(['isFavourite' => $isFavourite]);
    }

    /**
     * Record an app launch.
     */
    public function launch(Request $request, Team $currentTeam, TeamApp $app): JsonResponse
    {
        abort_if($app->team_id !== $currentTeam->id, 403);

        $request->user()->recentApps()->attach($app->id, ['launched_at' => now()]);

        return response()->json(['success' => true]);
    }
}
