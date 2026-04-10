<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Support\HubInbox;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InboxController extends Controller
{
    /**
     * Display the unified inbox.
     */
    public function index(Request $request, Team $currentTeam): Response
    {
        $items = HubInbox::itemsFor($currentTeam);

        return Inertia::render('hub/inbox/index', [
            'items' => $items,
            'totalUnread' => HubInbox::unreadCountFor($currentTeam),
        ]);
    }
}

