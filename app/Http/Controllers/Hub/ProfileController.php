<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the hub profile page.
     */
    public function index(Request $request, Team $currentTeam): Response
    {
        return Inertia::render('hub/profile/index', [
            'connectedAppsCount' => $currentTeam->apps()->count(),
        ]);
    }
}

