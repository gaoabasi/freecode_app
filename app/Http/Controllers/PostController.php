<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Show the form for creating a new post.
     */
    public function create(): Response
    {
        return Inertia::render('posts/create');
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'caption' => ['required', 'string', 'max:2200'],
            'image' => ['required', 'image', 'max:10240'], // max 10MB
        ]);

        $imagePath = $request->file('image')->store('posts', 'public');

        $post = $request->user()->posts()->create([
            'caption' => $validated['caption'],
            'image' => $imagePath,
        ]);

        return redirect()->route('posts.show', ['post' => $post->id])
            ->with('toast', ['type' => 'success', 'message' => 'Post created successfully!']);
    }

    /**
     * Display the specified post.
     */
    public function show(Request $request, Post $post): Response
    {
        $user = $request->user();

        $post->load(['user.profile', 'comments.user.profile']);
        $post->loadCount(['likes', 'comments']);

        return Inertia::render('posts/show', [
            'post' => [
                'id' => $post->id,
                'caption' => $post->caption,
                'image_url' => $post->image_url,
                'created_at' => $post->created_at->toISOString(),
                'created_at_human' => $post->created_at->diffForHumans(),
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'is_liked' => $user ? $post->isLikedBy($user) : false,
                'is_owner' => $user ? $user->id === $post->user_id : false,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'username' => $post->user->username ?? 'user_'.$post->user->id,
                    'avatar_url' => $post->user->avatarUrl(),
                ],
                'comments' => $post->comments->map(function ($comment) use ($user) {
                    return [
                        'id' => $comment->id,
                        'comment' => $comment->comment,
                        'created_at_human' => $comment->created_at->diffForHumans(),
                        'can_delete' => $user && ($user->id === $comment->user_id || $user->id === $comment->post->user_id),
                        'user' => [
                            'id' => $comment->user->id,
                            'name' => $comment->user->name,
                            'username' => $comment->user->username ?? 'user_'.$comment->user->id,
                            'avatar_url' => $comment->user->avatarUrl(),
                        ],
                    ];
                }),
            ],
        ]);
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(Request $request, Post $post): RedirectResponse
    {
        $user = $request->user();

        abort_if(! $user || $user->id !== $post->user_id, 403, 'Unauthorized');

        // Delete image file from storage if stored locally
        if (! str_starts_with($post->image, 'http')) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return redirect()->route('profile.show', ['user' => $user->username])
            ->with('toast', ['type' => 'success', 'message' => 'Post deleted successfully!']);
    }
}
