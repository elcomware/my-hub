<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    /**
     * Display the platform tenant directory.
     */
    public function index(Request $request): Response
    {
        $query = Team::query()
            ->where('is_personal', false)
            ->withCount(['members', 'apps', 'announcements']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $tenants = $query
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Team $team) => [
                'id' => $team->id,
                'name' => $team->name,
                'slug' => $team->slug,
                'status' => $team->status ?? 'active',
                'sector' => $team->sector,
                'primaryColor' => $team->primary_color,
                'membersCount' => $team->members_count,
                'appsCount' => $team->apps_count,
                'announcementsCount' => $team->announcements_count,
                'createdAt' => $team->created_at->toISOString(),
            ]);

        $statusCounts = Team::where('is_personal', false)
            ->select('status', \DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return Inertia::render('platform/tenants/index', [
            'tenants' => $tenants,
            'statusCounts' => $statusCounts,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'all'),
            ],
        ]);
    }

    /**
     * Display a single tenant's detail view.
     */
    public function show(Request $request, Team $tenant): Response
    {
        $tenant->loadCount(['members', 'apps', 'announcements', 'invitations']);

        $owner = $tenant->owner();

        return Inertia::render('platform/tenants/show', [
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'status' => $tenant->status ?? 'active',
                'sector' => $tenant->sector,
                'description' => $tenant->description,
                'primaryColor' => $tenant->primary_color,
                'accentColor' => $tenant->accent_color,
                'logoPath' => $tenant->logo_path,
                'membersCount' => $tenant->members_count,
                'appsCount' => $tenant->apps_count,
                'announcementsCount' => $tenant->announcements_count,
                'invitationsCount' => $tenant->invitations_count,
                'ownerName' => $owner?->name,
                'ownerEmail' => $owner?->email,
                'createdAt' => $tenant->created_at->toISOString(),
                'updatedAt' => $tenant->updated_at->toISOString(),
            ],
        ]);
    }

    /**
     * Update the tenant's status (suspend, activate, archive).
     */
    public function updateStatus(Request $request, Team $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['active', 'trial', 'suspended', 'archived'])],
        ]);

        $tenant->update(['status' => $validated['status']]);

        return back();
    }
}
