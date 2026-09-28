<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
    /**
     * Show the main Instagram feed or welcome landing page.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        if (! $user) {
            return Inertia::render('welcome');
        }

        // Get IDs of followed users
        $followingIds = $user->following()->pluck('following_id')->toArray();
        $feedUserIds = array_merge([$user->id], $followingIds);

        // Fetch posts
        $postsQuery = Post::query()
            ->with(['user.profile', 'comments.user.profile'])
            ->withCount(['likes', 'comments'])
            ->latest();

        // If following other users, show from followed + self; otherwise show recent posts
        if (! empty($followingIds)) {
            $postsQuery->whereIn('user_id', $feedUserIds);
        }

        $posts = $postsQuery->limit(20)->get()->map(function (Post $post) use ($user) {
            return [
                'id' => $post->id,
                'caption' => $post->caption,
                'image_url' => $post->image_url,
                'created_at' => $post->created_at->toISOString(),
                'created_at_human' => $post->created_at->diffForHumans(),
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'is_liked' => $post->isLikedBy($user),
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'username' => $post->user->username ?? 'user_'.$post->user->id,
                    'avatar_url' => $post->user->avatarUrl(),
                ],
                'comments' => $post->comments->take(3)->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'comment' => $comment->comment,
                        'created_at_human' => $comment->created_at->diffForHumans(),
                        'user' => [
                            'id' => $comment->user->id,
                            'name' => $comment->user->name,
                            'username' => $comment->user->username ?? 'user_'.$comment->user->id,
                        ],
                    ];
                }),
            ];
        });

        // Suggested users to follow (exclude self and already followed users)
        $suggestedUsers = User::query()
            ->with('profile')
            ->where('id', '!=', $user->id)
            ->whereNotIn('id', $followingIds)
            ->inRandomOrder()
            ->limit(5)
            ->get()
            ->map(fn (User $suggested) => [
                'id' => $suggested->id,
                'name' => $suggested->name,
                'username' => $suggested->username ?? 'user_'.$suggested->id,
                'avatar_url' => $suggested->avatarUrl(),
            ]);

        return Inertia::render('feed', [
            'posts' => $posts,
            'suggestedUsers' => $suggestedUsers,
        ]);
    }
}
