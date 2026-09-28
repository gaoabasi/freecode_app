<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\UserProfileController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - FreeCodeGram
|--------------------------------------------------------------------------
*/

// Home Feed / Welcome
Route::get('/', FeedController::class)->name('home');

// Explore / Discovery
Route::get('/explore', ExploreController::class)->name('explore');

// Authenticated Social Interactions
Route::middleware(['auth'])->group(function () {
    // Post Management
    Route::get('/p/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/p', [PostController::class, 'store'])->name('posts.store');
    Route::delete('/p/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

    // Likes & Comments
    Route::post('/p/{post}/like', [LikeController::class, 'toggle'])->name('posts.like');
    Route::post('/p/{post}/comments', [CommentController::class, 'store'])->name('posts.comments.store');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    // Profile Editing
    Route::get('/profile/edit-info', [UserProfileController::class, 'edit'])->name('profile.edit_info');
    Route::patch('/profile/update-info', [UserProfileController::class, 'update'])->name('profile.update_info');

    // Follows
    Route::post('/u/{user:username}/follow', [FollowController::class, 'toggle'])->name('users.follow');

    // Team Invitations (Starter kit compatibility)
    Route::post('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

// Single Post Page
Route::get('/p/{post}', [PostController::class, 'show'])->name('posts.show');

// Public User Profile
Route::get('/u/{user:username}', [UserProfileController::class, 'show'])->name('profile.show');

// Team Dashboard (Starter kit compatibility)
Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
    });

require __DIR__.'/settings.php';
