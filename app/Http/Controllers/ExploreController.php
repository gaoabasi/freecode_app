<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExploreController extends Controller
{
    /**
     * Display the explore grid and user search results.
     */
    public function __invoke(Request $request): Response
    {
        $query = trim((string) $request->input('q', ''));
        $matchingUsers = [];

        if ($query !== '') {
            $matchingUsers = User::query()
                ->with('profile')
                ->where('username', 'like', "%{$query}%")
                ->orWhere('name', 'like', "%{$query}%")
                ->limit(10)
                ->get()
                ->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username ?? 'user_'.$user->id,
                    'avatar_url' => $user->avatarUrl(),
                ]);
        }

        $posts = Post::query()
            ->with(['user.profile'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn (Post $post) => [
                'id' => $post->id,
                'caption' => $post->caption,
                'image_url' => $post->image_url,
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'username' => $post->user->username ?? 'user_'.$post->user->id,
                    'avatar_url' => $post->user->avatarUrl(),
                ],
            ]);

        return Inertia::render('explore', [
            'posts' => $posts,
            'matchingUsers' => $matchingUsers,
            'searchQuery' => $query,
        ]);
    }
}
