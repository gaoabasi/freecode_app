import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bookmark,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Send,
    Share2,
    Sparkles,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import InstagramLayout from '@/layouts/instagram-layout';
import type { Auth, FeedPost, PostUser } from '@/types';

interface FeedProps {
    posts: FeedPost[];
    suggestedUsers: PostUser[];
}

export default function Feed({ posts, suggestedUsers }: FeedProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const currentUser = auth?.user;

    return (
        <InstagramLayout>
            <Head title="Home • FreeCodeGram" />

            <div className="max-w-6xl mx-auto px-4 py-6 flex gap-10 justify-center">
                {/* Main Feed Column */}
                <div className="w-full max-w-[470px] flex flex-col gap-6">
                    {posts.length === 0 ? (
                        <div className="border border-border rounded-2xl p-8 text-center bg-card shadow-sm flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold mb-1">Welcome to FreeCodeGram!</h2>
                            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                                When you follow people or upload photos, their posts will appear here.
                            </p>
                            <Link href="/explore">
                                <Button className="font-semibold">Explore Trending Posts</Button>
                            </Link>
                        </div>
                    ) : (
                        posts.map((post) => <PostCard key={post.id} post={post} />)
                    )}
                </div>

                {/* Right Rail: Profile Preview & Suggested Users */}
                <div className="hidden xl:flex flex-col w-80 pt-2 shrink-0">
                    {currentUser && (
                        <div className="flex items-center justify-between gap-3 mb-6 p-2 rounded-xl">
                            <Link
                                href={`/u/${currentUser.username || `user_${currentUser.id}`}`}
                                className="flex items-center gap-3 group min-w-0"
                            >
                                <Avatar className="w-12 h-12 border border-border group-hover:opacity-90 transition-opacity">
                                    {(currentUser.avatar_url || currentUser.avatar) && (
                                        <AvatarImage
                                            src={
                                                (currentUser.avatar_url as string) ||
                                                (currentUser.avatar as string)
                                            }
                                            alt={currentUser.name}
                                        />
                                    )}
                                    <AvatarFallback>
                                        {currentUser.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-sm truncate group-hover:underline">
                                        {String(currentUser.username || `user_${currentUser.id}`)}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">
                                        {currentUser.name}
                                    </span>
                                </div>
                            </Link>
                            <Link
                                href="/profile/edit-info"
                                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                Edit
                            </Link>
                        </div>
                    )}

                    {/* Suggested Users */}
                    {suggestedUsers.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-sm font-semibold text-muted-foreground">
                                    Suggested for you
                                </span>
                                <Link
                                    href="/explore"
                                    className="text-xs font-semibold hover:underline"
                                >
                                    See All
                                </Link>
                            </div>

                            <div className="flex flex-col gap-2 mt-1">
                                {suggestedUsers.map((user) => (
                                    <SuggestedUserRow key={user.id} user={user} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer Links */}
                    <div className="mt-8 px-2 text-[11px] text-muted-foreground/70 leading-relaxed">
                        <p>© 2026 FreeCodeGram by DeepMind & Pair Programming.</p>
                        <p className="mt-1">Built with Laravel 13, Inertia.js, React 19 & Tailwind v4.</p>
                    </div>
                </div>
            </div>
        </InstagramLayout>
    );
}

function PostCard({ post }: { post: FeedPost }) {
    const [isLiked, setIsLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [likeAnim, setLikeAnim] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(post.comments);
    const [commentsCount, setCommentsCount] = useState(post.comments_count);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleToggleLike = () => {
        const nextLiked = !isLiked;
        setIsLiked(nextLiked);
        setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

        router.post(
            `/p/${post.id}/like`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    // Update if server returns state
                },
            }
        );
    };

    const handleDoubleTap = () => {
        if (!isLiked) {
            handleToggleLike();
        }
        setLikeAnim(true);
        setTimeout(() => setLikeAnim(false), 900);
    };

    const handleCommentSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        router.post(
            `/p/${post.id}/comments`,
            { comment: commentText },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setCommentText('');
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <article className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-xs">
            {/* Post Header */}
            <div className="flex items-center justify-between p-3.5 px-4">
                <Link
                    href={`/u/${post.user.username}`}
                    className="flex items-center gap-3 group"
                >
                    <Avatar className="w-9 h-9 border border-border">
                        {post.user.avatar_url && (
                            <AvatarImage src={post.user.avatar_url} alt={post.user.name} />
                        )}
                        <AvatarFallback className="text-xs">
                            {post.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm group-hover:underline leading-tight">
                            {post.user.username}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            {post.created_at_human}
                        </span>
                    </div>
                </Link>

                <Link
                    href={`/p/${post.id}`}
                    className="text-muted-foreground hover:text-foreground p-1 rounded-full"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </Link>
            </div>

            {/* Post Photo */}
            <div
                className="relative aspect-square w-full bg-black/90 cursor-pointer overflow-hidden flex items-center justify-center select-none"
                onDoubleClick={handleDoubleTap}
            >
                <img
                    src={post.image_url}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Animated Floating Heart */}
                {likeAnim && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-200">
                        <Heart className="w-24 h-24 fill-white text-white drop-shadow-lg scale-110" />
                    </div>
                )}
            </div>

            {/* Actions Bar */}
            <div className="p-3.5 px-4">
                <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleToggleLike}
                            className="transition-transform active:scale-125 focus:outline-hidden cursor-pointer"
                        >
                            <Heart
                                className={`w-6 h-6 transition-colors ${
                                    isLiked
                                        ? 'fill-rose-500 text-rose-500'
                                        : 'text-foreground hover:text-muted-foreground'
                                }`}
                            />
                        </button>
                        <Link
                            href={`/p/${post.id}`}
                            className="text-foreground hover:text-muted-foreground transition-colors"
                        >
                            <MessageCircle className="w-6 h-6" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'FreeCodeGram Post',
                                        url: `/p/${post.id}`,
                                    });
                                }
                            }}
                            className="text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        type="button"
                        className="text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
                    >
                        <Bookmark className="w-5 h-5" />
                    </button>
                </div>

                {/* Likes Counter */}
                <p className="font-semibold text-sm mb-1.5">
                    {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
                </p>

                {/* Caption */}
                <div className="text-sm leading-snug mb-2">
                    <Link
                        href={`/u/${post.user.username}`}
                        className="font-semibold mr-2 hover:underline"
                    >
                        {post.user.username}
                    </Link>
                    <span className="whitespace-pre-wrap">{post.caption}</span>
                </div>

                {/* Comments Preview */}
                {commentsCount > 0 && (
                    <Link
                        href={`/p/${post.id}`}
                        className="text-xs text-muted-foreground hover:underline block mb-2"
                    >
                        View all {commentsCount} comments
                    </Link>
                )}

                {comments.slice(0, 2).map((c) => (
                    <div key={c.id} className="text-xs leading-relaxed mb-1">
                        <Link
                            href={`/u/${c.user.username}`}
                            className="font-semibold mr-1.5 hover:underline"
                        >
                            {c.user.username}
                        </Link>
                        <span>{c.comment}</span>
                    </div>
                ))}

                {/* Quick Comment Input */}
                <form
                    onSubmit={handleCommentSubmit}
                    className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60"
                >
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full text-xs bg-transparent placeholder:text-muted-foreground focus:outline-hidden"
                    />
                    {commentText.trim() && (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Post
                        </button>
                    )}
                </form>
            </div>
        </article>
    );
}

function SuggestedUserRow({ user }: { user: PostUser }) {
    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFollowToggle = () => {
        setLoading(true);
        router.post(
            `/u/${user.username}/follow`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setFollowing((prev) => !prev);
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                },
            }
        );
    };

    return (
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-muted/40 transition-colors">
            <Link
                href={`/u/${user.username}`}
                className="flex items-center gap-2.5 min-w-0 group"
            >
                <Avatar className="w-9 h-9 border border-border">
                    {user.avatar_url && (
                        <AvatarImage src={user.avatar_url} alt={user.name} />
                    )}
                    <AvatarFallback className="text-xs">
                        {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-xs truncate group-hover:underline">
                        {user.username}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                        {user.name}
                    </span>
                </div>
            </Link>

            <button
                type="button"
                onClick={handleFollowToggle}
                disabled={loading}
                className={`text-xs font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    following
                        ? 'text-muted-foreground hover:text-destructive'
                        : 'text-primary hover:text-primary/80'
                }`}
            >
                {following ? 'Following' : 'Follow'}
            </button>
        </div>
    );
}
