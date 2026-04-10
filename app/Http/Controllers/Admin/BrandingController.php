<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BrandingController extends Controller
{
    /**
     * Display the branding management screen.
     */
    public function edit(Request $request, Team $currentTeam): Response
    {
        Gate::authorize('manageBranding', $currentTeam);

        return Inertia::render('admin/branding/index', [
            'branding' => [
                'name' => $currentTeam->name,
                'logoPath' => $currentTeam->logo_path,
                'primaryColor' => $currentTeam->primary_color,
                'accentColor' => $currentTeam->accent_color,
                'description' => $currentTeam->description,
                'sector' => $currentTeam->sector,
            ],
        ]);
    }

    /**
     * Update the branding settings.
     */
    public function update(Request $request, Team $currentTeam): RedirectResponse
    {
        Gate::authorize('manageBranding', $currentTeam);

        $validated = $request->validate([
            'primary_color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'accent_color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'description' => ['nullable', 'string', 'max:500'],
            'sector' => ['nullable', 'string', 'max:100'],
        ]);

        $currentTeam->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Branding updated.')]);

        return back();
    }
}
