import { Head, Link, router } from '@inertiajs/react';
import {
    Camera,
    ExternalLink,
    Grid3X3,
    Heart,
    MessageCircle,
    Settings,
} from 'lucide-react';
import { useState } from 'react';
import CreatePostModal from '@/components/create-post-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import InstagramLayout from '@/layouts/instagram-layout';
import type { GridPost, ProfileUser } from '@/types';

interface ProfileProps {
    profileUser: ProfileUser;
    posts: GridPost[];
    isSelf: boolean;
    isFollowing: boolean;
}

export default function Profile({
    profileUser,
    posts,
    isSelf,
    isFollowing: initialFollowing,
}: ProfileProps) {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [followersCount, setFollowersCount] = useState(profileUser.followers_count);
    const [followLoading, setFollowLoading] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);

    const handleToggleFollow = () => {
        setFollowLoading(true);
        const nextState = !isFollowing;
        setIsFollowing(nextState);
        setFollowersCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

        router.post(
            `/u/${profileUser.username}/follow`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setFollowLoading(false);
                },
            }
        );
    };

    return (
        <InstagramLayout>
            <Head title={`${profileUser.name} (@${profileUser.username}) • FreeCodeGram`} />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <header className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 pb-10 border-b border-border">
                    {/* Avatar */}
                    <div className="relative group shrink-0">
                        <Avatar className="w-24 h-24 md:w-36 md:h-36 border-2 border-border shadow-md">
                            {profileUser.avatar_url && (
                                <AvatarImage
                                    src={profileUser.avatar_url}
                                    alt={profileUser.name}
                                    className="object-cover"
                                />
                            )}
                            <AvatarFallback className="text-2xl md:text-4xl font-bold">
                                {profileUser.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        {isSelf && (
                            <Link
                                href="/profile/edit-info"
                                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                            >
                                <Camera className="w-6 h-6" />
                            </Link>
                        )}
                    </div>

                    {/* Info Column */}
                    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-4 min-w-0">
                        {/* Row 1: Username & Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                                {profileUser.username}
                            </h1>

                            {isSelf ? (
                                <div className="flex items-center gap-2">
                                    <Link href="/profile/edit-info">
                                        <Button variant="secondary" size="sm" className="font-semibold">
                                            Edit profile
                                        </Button>
                                    </Link>
                                    <Link href="/settings/profile">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <Button
                                    variant={isFollowing ? 'secondary' : 'default'}
                                    size="sm"
                                    onClick={handleToggleFollow}
                                    disabled={followLoading}
                                    className="font-semibold px-6 cursor-pointer"
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Button>
                            )}
                        </div>

                        {/* Row 2: Stats Count */}
                        <ul className="flex items-center gap-8 text-sm">
                            <li>
                                <span className="font-bold">{profileUser.posts_count}</span>{' '}
                                <span className="text-muted-foreground">posts</span>
                            </li>
                            <li>
                                <span className="font-bold">{followersCount}</span>{' '}
                                <span className="text-muted-foreground">followers</span>
                            </li>
                            <li>
                                <span className="font-bold">{profileUser.following_count}</span>{' '}
                                <span className="text-muted-foreground">following</span>
                            </li>
                        </ul>

                        {/* Row 3: Name, Bio, and Website */}
                        <div className="flex flex-col gap-1 text-sm max-w-md">
                            {profileUser.title && (
                                <span className="font-bold text-foreground">
                                    {profileUser.title}
                                </span>
                            )}
                            {profileUser.bio && (
                                <p className="whitespace-pre-line text-foreground/90">
                                    {profileUser.bio}
                                </p>
                            )}
                            {profileUser.url && (
                                <a
                                    href={profileUser.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-xs mt-1"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>
                                        {profileUser.url.replace(/^https?:\/\//, '')}
                                    </span>
                                </a>
                            )}
                        </div>
                    </div>
                </header>

                {/* Tab Header */}
                <div className="flex justify-center border-t border-border -mt-px mb-6">
                    <div className="flex items-center gap-1.5 py-3 border-t-2 border-foreground text-xs font-semibold uppercase tracking-wider">
                        <Grid3X3 className="w-3.5 h-3.5" />
                        <span>Posts</span>
                    </div>
                </div>

                {/* Posts Grid */}
                {posts.length === 0 ? (
                    <div className="py-16 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-4 text-muted-foreground">
                            <Camera className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">
                            {isSelf ? 'Share Photos' : 'No Posts Yet'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                            {isSelf
                                ? 'When you share photos, they will appear on your profile for your followers.'
                                : `${profileUser.name} hasn't posted anything yet.`}
                        </p>
                        {isSelf && (
                            <Button
                                size="sm"
                                onClick={() => setCreateOpen(true)}
                                className="font-semibold"
                            >
                                Share your first photo
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-1 sm:gap-4 md:gap-6">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/p/${post.id}`}
                                className="relative aspect-square overflow-hidden rounded-md sm:rounded-xl group bg-muted/40"
                            >
                                <img
                                    src={post.image_url}
                                    alt={post.caption}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />

                                {/* Hover Overlay with Stats */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-semibold text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <Heart className="w-5 h-5 fill-white" />
                                        <span>{post.likes_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MessageCircle className="w-5 h-5 fill-white" />
                                        <span>{post.comments_count}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <CreatePostModal open={createOpen} onOpenChange={setCreateOpen} />
        </InstagramLayout>
    );
}
