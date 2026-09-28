<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserProfileController extends Controller
{
    /**
     * Display the specified user's profile.
     */
    public function show(Request $request, User $user): Response
    {
        $currentUser = $request->user();

        $user->load('profile');
        $user->loadCount(['posts', 'followers', 'following']);

        $posts = $user->posts()
            ->withCount(['likes', 'comments'])
            ->latest()
            ->get()
            ->map(fn ($post) => [
                'id' => $post->id,
                'caption' => $post->caption,
                'image_url' => $post->image_url,
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'created_at' => $post->created_at->toISOString(),
            ]);

        $isSelf = $currentUser && $currentUser->id === $user->id;
        $isFollowing = $currentUser && ! $isSelf ? $currentUser->isFollowing($user) : false;

        return Inertia::render('profile', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username ?? 'user_'.$user->id,
                'avatar_url' => $user->avatarUrl(),
                'title' => $user->profile?->title,
                'bio' => $user->profile?->bio,
                'url' => $user->profile?->url,
                'posts_count' => $user->posts_count,
                'followers_count' => $user->followers_count,
                'following_count' => $user->following_count,
            ],
            'posts' => $posts,
            'isSelf' => $isSelf,
            'isFollowing' => $isFollowing,
        ]);
    }

    /**
     * Show the form for editing the current user's profile.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $user->load('profile');

        return Inertia::render('edit-profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'avatar_url' => $user->avatarUrl(),
                'title' => $user->profile?->title,
                'bio' => $user->profile?->bio,
                'url' => $user->profile?->url,
            ],
        ]);
    }

    /**
     * Update the current user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'alpha_dash',
                'min:3',
                'max:30',
                Rule::unique(User::class)->ignore($user->id),
            ],
            'title' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:500'],
            'url' => ['nullable', 'url', 'max:255'],
            'image' => ['nullable', 'image', 'max:5120'], // 5MB max
        ]);

        $user->update([
            'name' => $validated['name'],
            'username' => strtolower($validated['username']),
        ]);

        $profileData = [
            'title' => $validated['title'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'url' => $validated['url'] ?? null,
        ];

        if ($request->hasFile('image')) {
            // Delete old avatar if not external
            if ($user->profile?->image && ! str_starts_with($user->profile->image, 'http')) {
                Storage::disk('public')->delete($user->profile->image);
            }

            $profileData['image'] = $request->file('image')->store('avatars', 'public');
        }

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $profileData
        );

        return redirect()->route('profile.show', ['user' => $user->username])
            ->with('toast', ['type' => 'success', 'message' => 'Profile updated successfully!']);
    }
}
