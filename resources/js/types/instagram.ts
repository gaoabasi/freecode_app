export type PostUser = {
    id: number;
    name: string;
    username: string;
    avatar_url: string | null;
};

export type PostComment = {
    id: number;
    comment: string;
    created_at_human: string;
    can_delete?: boolean;
    user: PostUser;
};

export type FeedPost = {
    id: number;
    caption: string;
    image_url: string;
    created_at: string;
    created_at_human: string;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    is_owner?: boolean;
    user: PostUser;
    comments: PostComment[];
};

export type ProfileUser = {
    id: number;
    name: string;
    username: string;
    avatar_url: string | null;
    title: string | null;
    bio: string | null;
    url: string | null;
    posts_count: number;
    followers_count: number;
    following_count: number;
};

export type GridPost = {
    id: number;
    caption: string;
    image_url: string;
    likes_count: number;
    comments_count: number;
    created_at?: string;
    user?: PostUser;
};
