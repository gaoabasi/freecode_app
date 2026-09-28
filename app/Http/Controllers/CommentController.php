<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Store a new comment on a post.
     */
    public function store(Request $request, Post $post): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        $comment = $post->comments()->create([
            'user_id' => $request->user()->id,
            'comment' => $validated['comment'],
        ]);

        if ($request->wantsJson()) {
            $comment->load('user.profile');

            return response()->json([
                'comment' => [
                    'id' => $comment->id,
                    'comment' => $comment->comment,
                    'created_at_human' => $comment->created_at->diffForHumans(),
                    'user' => [
                        'id' => $comment->user->id,
                        'name' => $comment->user->name,
                        'username' => $comment->user->username,
                        'avatar_url' => $comment->user->avatarUrl(),
                    ],
                ],
            ]);
        }

        return back()->with('toast', ['type' => 'success', 'message' => 'Comment added!']);
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(Request $request, Comment $comment): RedirectResponse
    {
        $user = $request->user();

        abort_if(
            ! $user || ($user->id !== $comment->user_id && $user->id !== $comment->post->user_id),
            403,
            'Unauthorized'
        );

        $comment->delete();

        return back()->with('toast', ['type' => 'success', 'message' => 'Comment deleted.']);
    }
}
