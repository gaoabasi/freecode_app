<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    /**
     * Toggle follow status for the specified user.
     */
    public function toggle(Request $request, User $user): JsonResponse|RedirectResponse
    {
        $currentUser = $request->user();

        abort_if($currentUser->id === $user->id, 400, 'You cannot follow yourself.');

        $isFollowing = $currentUser->isFollowing($user);

        if ($isFollowing) {
            $currentUser->following()->detach($user->id);
            $isFollowing = false;
        } else {
            $currentUser->following()->attach($user->id);
            $isFollowing = true;
        }

        $followersCount = $user->followers()->count();

        if ($request->wantsJson()) {
            return response()->json([
                'is_following' => $isFollowing,
                'followers_count' => $followersCount,
            ]);
        }

        return back();
    }
}
