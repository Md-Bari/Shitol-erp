<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->role === 'admin', 403);

        return response()->json(['data' => User::query()->latest()->get()->map(fn (User $user) => $this->payload($user))]);
    }

    public function store(Request $request): JsonResponse
    {
        abort_unless($request->user()->role === 'admin', 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', 'in:admin,manager,user'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['status'] = $data['status'] ?? 'active';

        $user = User::query()->create($data);

        return response()->json(['data' => $this->payload($user)], 201);
    }

    public function updateStatus(Request $request, User $user): JsonResponse
    {
        abort_unless($request->user()->role === 'admin', 403);

        $data = $request->validate([
            'status' => ['required', 'in:active,inactive'],
        ]);

        $user->update($data);

        return response()->json(['data' => $this->payload($user->fresh())]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        abort_unless($request->user()->role === 'admin', 403);
        abort_if($request->user()->id === $user->id, 422, 'You cannot delete your own user account.');

        $user->delete();

        return response()->json(null, 204);
    }

    private function payload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
            'avatar' => $user->avatar,
            'created_at' => $user->created_at?->toISOString(),
        ];
    }
}
