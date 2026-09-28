<?php

namespace Tests\Feature;

use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class InstagramTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_sees_welcome_page(): void
    {
        $response = $this->get('/');

        $response->assertOk();
    }

    public function test_authenticated_user_sees_feed(): void
    {
        $user = User::factory()->create([
            'username' => 'testuser',
        ]);

        $response = $this->actingAs($user)->get('/');

        $response->assertOk();
    }

    public function test_user_can_create_a_post(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'username' => 'photographer',
        ]);

        $file = UploadedFile::fake()->image('nature.jpg', 600, 600);

        $response = $this->actingAs($user)->post('/p', [
            'caption' => 'Beautiful sunset photo! #nature',
            'image' => $file,
        ]);

        $post = Post::first();

        $this->assertNotNull($post);
        $this->assertEquals('Beautiful sunset photo! #nature', $post->caption);
        $this->assertEquals($user->id, $post->user_id);
        Storage::disk('public')->assertExists($post->image);

        $response->assertRedirect(route('posts.show', ['post' => $post->id]));
    }

    public function test_user_can_view_single_post(): void
    {
        $user = User::factory()->create(['username' => 'creator']);
        $post = $user->posts()->create([
            'caption' => 'Check this out',
            'image' => 'https://example.com/photo.jpg',
        ]);

        $response = $this->get("/p/{$post->id}");

        $response->assertOk();
    }

    public function test_author_can_delete_their_post(): void
    {
        Storage::fake('public');

        $user = User::factory()->create(['username' => 'author']);
        $file = UploadedFile::fake()->image('sunset.jpg');
        $imagePath = $file->store('posts', 'public');

        $post = $user->posts()->create([
            'caption' => 'Delete me later',
            'image' => $imagePath,
        ]);

        $response = $this->actingAs($user)->delete("/p/{$post->id}");

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
        $response->assertRedirect(route('profile.show', ['user' => $user->username]));
    }

    public function test_user_cannot_delete_another_users_post(): void
    {
        $user1 = User::factory()->create(['username' => 'user1']);
        $user2 = User::factory()->create(['username' => 'user2']);

        $post = $user1->posts()->create([
            'caption' => 'Protected post',
            'image' => 'https://example.com/image.jpg',
        ]);

        $response = $this->actingAs($user2)->delete("/p/{$post->id}");

        $response->assertForbidden();
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }

    public function test_user_can_like_and_unlike_a_post(): void
    {
        $author = User::factory()->create(['username' => 'author']);
        $liker = User::factory()->create(['username' => 'liker']);

        $post = $author->posts()->create([
            'caption' => 'Great day',
            'image' => 'https://example.com/test.jpg',
        ]);

        // First like
        $response = $this->actingAs($liker)->postJson("/p/{$post->id}/like");
        $response->assertOk()
            ->assertJson(['is_liked' => true, 'likes_count' => 1]);
        $this->assertDatabaseHas('likes', [
            'user_id' => $liker->id,
            'post_id' => $post->id,
        ]);

        // Unlike
        $response = $this->actingAs($liker)->postJson("/p/{$post->id}/like");
        $response->assertOk()
            ->assertJson(['is_liked' => false, 'likes_count' => 0]);
        $this->assertDatabaseMissing('likes', [
            'user_id' => $liker->id,
            'post_id' => $post->id,
        ]);
    }

    public function test_user_can_comment_on_a_post(): void
    {
        $author = User::factory()->create(['username' => 'author']);
        $commenter = User::factory()->create(['username' => 'commenter']);

        $post = $author->posts()->create([
            'caption' => 'New artwork',
            'image' => 'https://example.com/art.jpg',
        ]);

        $response = $this->actingAs($commenter)->postJson("/p/{$post->id}/comments", [
            'comment' => 'Incredible colors! Love the vibe.',
        ]);

        $response->assertOk()
            ->assertJsonPath('comment.comment', 'Incredible colors! Love the vibe.');

        $this->assertDatabaseHas('comments', [
            'user_id' => $commenter->id,
            'post_id' => $post->id,
            'comment' => 'Incredible colors! Love the vibe.',
        ]);
    }

    public function test_user_can_follow_and_unfollow_another_user(): void
    {
        $user1 = User::factory()->create(['username' => 'follower']);
        $user2 = User::factory()->create(['username' => 'star']);

        // Follow
        $response = $this->actingAs($user1)->postJson("/u/{$user2->username}/follow");
        $response->assertOk()
            ->assertJson(['is_following' => true, 'followers_count' => 1]);

        $this->assertTrue($user1->isFollowing($user2));

        // Unfollow
        $response = $this->actingAs($user1)->postJson("/u/{$user2->username}/follow");
        $response->assertOk()
            ->assertJson(['is_following' => false, 'followers_count' => 0]);

        $this->assertFalse($user1->isFollowing($user2));
    }

    public function test_user_cannot_follow_themselves(): void
    {
        $user = User::factory()->create(['username' => 'myself']);

        $response = $this->actingAs($user)->postJson("/u/{$user->username}/follow");

        $response->assertStatus(400);
    }

    public function test_user_can_view_profile(): void
    {
        $user = User::factory()->create(['username' => 'johndoe']);

        $response = $this->get("/u/{$user->username}");

        $response->assertOk();
    }

    public function test_user_can_update_profile_info(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'name' => 'Original Name',
            'username' => 'oldusername',
        ]);

        $avatar = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $response = $this->actingAs($user)->patch('/profile/update-info', [
            'name' => 'Updated Name',
            'username' => 'newusername',
            'title' => 'Senior Developer',
            'bio' => 'Coding around the world',
            'url' => 'https://example.com',
            'image' => $avatar,
        ]);

        $response->assertRedirect(route('profile.show', ['user' => 'newusername']));

        $user->refresh();
        $this->assertEquals('Updated Name', $user->name);
        $this->assertEquals('newusername', $user->username);
        $this->assertEquals('Senior Developer', $user->profile->title);
        $this->assertEquals('Coding around the world', $user->profile->bio);
        Storage::disk('public')->assertExists($user->profile->image);
    }

    public function test_explore_page_displays_and_searches(): void
    {
        User::factory()->create(['username' => 'searchable_user', 'name' => 'Find Me']);

        $response = $this->get('/explore?q=searchable');

        $response->assertOk();
    }
}
