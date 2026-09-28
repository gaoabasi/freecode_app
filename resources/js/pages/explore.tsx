import { Head, Link, router } from '@inertiajs/react';
import { Heart, MessageCircle, Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import InstagramLayout from '@/layouts/instagram-layout';
import type { GridPost, PostUser } from '@/types';

interface ExploreProps {
    posts: GridPost[];
    matchingUsers: PostUser[];
    searchQuery: string;
}

export default function Explore({
    posts,
    matchingUsers,
    searchQuery: initialQuery,
}: ExploreProps) {
    const [query, setQuery] = useState(initialQuery || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/explore',
            { q: query.trim() },
            { preserveState: true, replace: true }
        );
    };

    return (
        <InstagramLayout>
            <Head title="Explore • FreeCodeGram" />

            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
                    <div className="relative flex items-center">
                        <Search className="w-4 h-4 absolute left-3.5 text-muted-foreground pointer-events-none" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search creators or posts..."
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-input bg-muted/40 placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </form>

                {/* Matching Users List (if searched) */}
                {matchingUsers && matchingUsers.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            People
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {matchingUsers.map((user) => (
                                <Link
                                    key={user.id}
                                    href={`/u/${user.username}`}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-card hover:border-primary/50 transition-colors group"
                                >
                                    <Avatar className="w-10 h-10 border border-border">
                                        {user.avatar_url && (
                                            <AvatarImage src={user.avatar_url} alt={user.name} />
                                        )}
                                        <AvatarFallback>
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-semibold text-sm truncate group-hover:underline">
                                            {user.username}
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate">
                                            {user.name}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3-Column Square Photo Grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <p className="text-base font-medium">No posts found.</p>
                        <p className="text-xs mt-1">Be the first to share a photo!</p>
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
        </InstagramLayout>
    );
}
