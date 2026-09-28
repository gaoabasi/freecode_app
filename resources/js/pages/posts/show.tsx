import { Head, Link, router } from '@inertiajs/react';
import {
    Bookmark,
    ChevronLeft,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Share2,
    Trash2,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import InstagramLayout from '@/layouts/instagram-layout';
import type { FeedPost } from '@/types';

interface PostShowProps {
    post: FeedPost;
}

export default function PostShow({ post }: PostShowProps) {
    const [isLiked, setIsLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [commentText, setCommentText] = useState('');
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
            }
        );
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

    const handleDeletePost = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(`/p/${post.id}`);
        }
    };

    const handleDeleteComment = (commentId: number) => {
        if (confirm('Delete this comment?')) {
            router.delete(`/comments/${commentId}`, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    return (
        <InstagramLayout>
            <Head title={`Post by ${post.user.name} (@${post.user.username}) • FreeCodeGram`} />

            <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
                <div className="mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>

                <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm flex flex-col md:flex-row max-h-[85vh]">
                    {/* Left Column: Post Photo */}
                    <div className="flex-1 bg-black flex items-center justify-center min-h-[350px] md:min-h-[550px] overflow-hidden">
                        <img
                            src={post.image_url}
                            alt={post.caption}
                            className="w-full h-full object-contain max-h-[85vh]"
                        />
                    </div>

                    {/* Right Column: Author, Comments, & Actions */}
                    <div className="w-full md:w-[380px] lg:w-[420px] flex flex-col border-t md:border-t-0 md:border-l border-border bg-card">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <Link
                                href={`/u/${post.user.username}`}
                                className="flex items-center gap-3 group min-w-0"
                            >
                                <Avatar className="w-9 h-9 border border-border">
                                    {post.user.avatar_url && (
                                        <AvatarImage
                                            src={post.user.avatar_url}
                                            alt={post.user.name}
                                        />
                                    )}
                                    <AvatarFallback>
                                        {post.user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-sm group-hover:underline truncate">
                                        {post.user.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">
                                        {post.user.name}
                                    </span>
                                </div>
                            </Link>

                            {post.is_owner && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1 rounded-full text-muted-foreground hover:text-foreground cursor-pointer">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={handleDeletePost}
                                            className="text-destructive focus:text-destructive cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Post
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* Scrollable Comments & Caption Area */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-sm">
                            {/* Caption Row */}
                            {post.caption && (
                                <div className="flex items-start gap-3 pb-3 border-b border-border/50">
                                    <Link href={`/u/${post.user.username}`} className="shrink-0">
                                        <Avatar className="w-8 h-8 border border-border">
                                            {post.user.avatar_url && (
                                                <AvatarImage
                                                    src={post.user.avatar_url}
                                                    alt={post.user.name}
                                                />
                                            )}
                                            <AvatarFallback className="text-[10px]">
                                                {post.user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="flex-1 text-xs leading-relaxed">
                                        <Link
                                            href={`/u/${post.user.username}`}
                                            className="font-bold mr-1.5 hover:underline"
                                        >
                                            {post.user.username}
                                        </Link>
                                        <span className="whitespace-pre-wrap">{post.caption}</span>
                                        <div className="text-[10px] text-muted-foreground mt-1">
                                            {post.created_at_human}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Comments List */}
                            {post.comments.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground text-xs">
                                    <p className="font-semibold mb-1">No comments yet.</p>
                                    <p>Start the conversation.</p>
                                </div>
                            ) : (
                                post.comments.map((comment) => (
                                    <div key={comment.id} className="flex items-start gap-3 group">
                                        <Link href={`/u/${comment.user.username}`} className="shrink-0">
                                            <Avatar className="w-7 h-7 border border-border">
                                                {comment.user.avatar_url && (
                                                    <AvatarImage
                                                        src={comment.user.avatar_url}
                                                        alt={comment.user.name}
                                                    />
                                                )}
                                                <AvatarFallback className="text-[10px]">
                                                    {comment.user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div className="flex-1 text-xs leading-relaxed">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Link
                                                        href={`/u/${comment.user.username}`}
                                                        className="font-bold mr-1.5 hover:underline"
                                                    >
                                                        {comment.user.username}
                                                    </Link>
                                                    <span>{comment.comment}</span>
                                                </div>

                                                {comment.can_delete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-1 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground mt-1">
                                                {comment.created_at_human}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Actions & Comment Input (sticky at bottom) */}
                        <div className="p-4 border-t border-border bg-card shrink-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={handleToggleLike}
                                        className="transition-transform active:scale-125 cursor-pointer"
                                    >
                                        <Heart
                                            className={`w-6 h-6 transition-colors ${
                                                isLiked
                                                    ? 'fill-rose-500 text-rose-500'
                                                    : 'text-foreground hover:text-muted-foreground'
                                            }`}
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: 'FreeCodeGram Post',
                                                    url: window.location.href,
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

                            <p className="font-semibold text-sm mb-1">
                                {likesCount.toLocaleString()}{' '}
                                {likesCount === 1 ? 'like' : 'likes'}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
                                {post.created_at_human}
                            </p>

                            {/* Comment Form */}
                            <form
                                onSubmit={handleCommentSubmit}
                                className="flex items-center gap-2 pt-2 border-t border-border/60"
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
                    </div>
                </div>
            </div>
        </InstagramLayout>
    );
}
