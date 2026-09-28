<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $user_id
 * @property string|null $title
 * @property string|null $bio
 * @property string|null $url
 * @property string|null $image
 * @property-read string $image_url
 * @property-read User $user
 */
class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'bio',
        'url',
        'image',
    ];

    /**
     * Get the user that owns the profile.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Accessor for profile image URL.
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->image) {
                    // Check if it's already an absolute URL (e.g. from seeders / external CDN)
                    if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
                        return $this->image;
                    }

                    return Storage::disk('public')->url($this->image);
                }

                // Default placeholder avatar with user initial / style
                $name = urlencode($this->user?->name ?? 'User');

                return "https://ui-avatars.com/api/?name={$name}&background=18181b&color=fafafa&size=256";
            }
        );
    }
}
