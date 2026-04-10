<?php

namespace App\Http\Controllers;

use App\Models\DeviceToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Http\JsonResponse;

class PushController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
            'platform' => 'nullable|string',
            'device' => 'nullable|string',
        ]);
        $user = Auth::user();
        $user->deviceTokens()->updateOrCreate(
            ['token' => $request->token],
            [
                'platform' => $request->platform,
                'device' => $request->device,
            ]
        );
        return response()->json(['status' => 'ok']);
    }

    public function unregister(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
        ]);
        $user = Auth::user();
        $user->deviceTokens()->where('token', $request->token)->delete();
        return response()->json(['status' => 'ok']);
    }
}
