<?php

namespace Database\Seeders;

use App\Actions\Teams\CreateTeam;
use App\Models\Comment;
use App\Models\Like;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $createTeam = app(CreateTeam::class);

        $demoUsers = [
            [
                'name' => 'Gao',
                'username' => 'gao',
                'email' => 'gao@example.com',
                'password' => Hash::make('password'),
                'title' => 'Gao | Software Engineer',
                'bio' => 'Building scalable web apps with Laravel & React 🚀 Passionate about clean code and creative design.',
                'url' => 'https://github.com',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                'posts' => [
                    [
                        'caption' => 'First post on FreeCodeGram! Loving this modern React 19 + Inertia stack. 💻✨',
                        'image' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80',
                    ],
                    [
                        'caption' => 'Late night workspace vibes. Nothing beats deep focus with good music. ☕🎧',
                        'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80',
                    ],
                ],
            ],
            [
                'name' => 'Alex Rivera',
                'username' => 'alex_photos',
                'email' => 'alex@example.com',
                'password' => Hash::make('password'),
                'title' => 'Alex Rivera Photography',
                'bio' => 'Visual storyteller & landscape photographer 📸 Chasing Golden Hour around the globe.',
                'url' => 'https://unsplash.com',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
                'posts' => [
                    [
                        'caption' => "Misty morning in the Pacific Northwest. Nature's calm before the day awakens. 🌲⛰️",
                        'image' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
                    ],
                    [
                        'caption' => 'Dramatic coastlines and wild waves. One of my favorite captures from Oregon coast. 🌊',
                        'image' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1000&auto=format&fit=crop&q=80',
                    ],
                    [
                        'caption' => 'Sunset over the alpine peaks. The gradient in the sky was unreal. 🏔️🌅',
                        'image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
                    ],
                ],
            ],
            [
                'name' => 'Sarah Chen',
                'username' => 'sarah_dev',
                'email' => 'sarah@example.com',
                'password' => Hash::make('password'),
                'title' => 'Sarah Chen • Design Engineer',
                'bio' => 'Obsessed with typography, subtle animations & clean UI components. 🎨 Design system enthusiast.',
                'url' => 'https://dribbble.com',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
                'posts' => [
                    [
                        'caption' => 'Minimalist architectural lines in Tokyo. Perfect balance of form and light. 🏛️',
                        'image' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
                    ],
                    [
                        'caption' => 'Crafting new design system primitives today. Smooth micro-interactions make all the difference! ✨',
                        'image' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80',
                    ],
                ],
            ],
            [
                'name' => 'Elena Rostova',
                'username' => 'elena_nature',
                'email' => 'elena@example.com',
                'password' => Hash::make('password'),
                'title' => 'Elena Rostova',
                'bio' => "Forest walks & mountain trails. Documenting Earth's wonders one photo at a time. 🌿🐾",
                'url' => 'https://instagram.com',
                'avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
                'posts' => [
                    [
                        'caption' => 'Dolomites reflections in the crystal-clear lake. Nature is the best artist. 🍃',
                        'image' => 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80',
                    ],
                    [
                        'caption' => 'Quiet paths through autumn leaves. Who else loves the crisp fall air? 🍂',
                        'image' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&auto=format&fit=crop&q=80',
                    ],
                ],
            ],
        ];

        $createdUsers = [];
        $allCreatedPosts = [];

        foreach ($demoUsers as $userData) {
            $user = User::query()->where('email', $userData['email'])->first();

            if (! $user) {
                $user = User::create([
                    'name' => $userData['name'],
                    'username' => $userData['username'],
                    'email' => $userData['email'],
                    'password' => $userData['password'],
                ]);

                $createTeam->handle($user, $user->name."'s Space", isPersonal: true);
            } else {
                $user->update([
                    'name' => $userData['name'],
                    'username' => $userData['username'],
                ]);
            }

            // Update profile info
            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'title' => $userData['title'],
                    'bio' => $userData['bio'],
                    'url' => $userData['url'],
                    'image' => $userData['avatar'],
                ]
            );

            // Create posts if not already present
            if ($user->posts()->count() === 0) {
                foreach ($userData['posts'] as $postData) {
                    $post = $user->posts()->create([
                        'caption' => $postData['caption'],
                        'image' => $postData['image'],
                    ]);
                    $allCreatedPosts[] = $post;
                }
            } else {
                foreach ($user->posts as $p) {
                    $allCreatedPosts[] = $p;
                }
            }

            $createdUsers[] = $user;
        }

        // Establish follow relationships
        if (count($createdUsers) >= 4) {
            $u1 = $createdUsers[0]; // Gao
            $u2 = $createdUsers[1]; // Alex
            $u3 = $createdUsers[2]; // Sarah
            $u4 = $createdUsers[3]; // Elena

            $u1->following()->syncWithoutDetaching([$u2->id, $u3->id, $u4->id]);
            $u2->following()->syncWithoutDetaching([$u1->id, $u3->id]);
            $u3->following()->syncWithoutDetaching([$u1->id, $u2->id, $u4->id]);
            $u4->following()->syncWithoutDetaching([$u1->id]);
        }

        // Seed some likes and comments
        foreach ($allCreatedPosts as $index => $post) {
            // Add likes from multiple users
            foreach ($createdUsers as $u) {
                if (($u->id + $post->id) % 2 === 0) {
                    Like::firstOrCreate([
                        'user_id' => $u->id,
                        'post_id' => $post->id,
                    ]);
                }
            }

            // Add comments
            if ($index % 2 === 0 && count($createdUsers) > 2) {
                Comment::firstOrCreate([
                    'user_id' => $createdUsers[1]->id,
                    'post_id' => $post->id,
                    'comment' => 'Stunning shot! The lighting and composition are incredible. 🔥',
                ]);
                Comment::firstOrCreate([
                    'user_id' => $createdUsers[2]->id,
                    'post_id' => $post->id,
                    'comment' => 'Love this! Keep inspiring us 🙌',
                ]);
            }
        }
    }
}
