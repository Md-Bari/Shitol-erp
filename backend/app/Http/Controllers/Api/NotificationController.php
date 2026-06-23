<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Notification::query()->latest()->limit(50)->get()]);
    }

    public function markAsRead(Notification $notification): JsonResponse
    {
        $notification->update(['read' => true]);

        return response()->json(['data' => $notification->fresh()]);
    }

    public function markAllAsRead(): JsonResponse
    {
        Notification::query()->where('read', false)->update(['read' => true]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }

    public function destroy(Notification $notification): JsonResponse
    {
        $notification->delete();

        return response()->json(null, 204);
    }
}
