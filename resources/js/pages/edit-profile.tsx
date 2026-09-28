import { Head, Link, useForm } from '@inertiajs/react';
import { Camera, Check, ChevronLeft, Loader2 } from 'lucide-react';
import { type ChangeEvent, type FormEvent, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InstagramLayout from '@/layouts/instagram-layout';

interface EditProfileProps {
    user: {
        id: number;
        name: string;
        username: string;
        email: string;
        avatar_url: string | null;
        title: string | null;
        bio: string | null;
        url: string | null;
    };
}

export default function EditProfile({ user }: EditProfileProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar_url
    );

    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        name: string;
        username: string;
        title: string;
        bio: string;
        url: string;
        image: File | null;
    }>({
        _method: 'PATCH',
        name: user.name || '',
        username: user.username || '',
        title: user.title || '',
        bio: user.bio || '',
        url: user.url || '',
        image: null,
    });

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/profile/update-info', {
            forceFormData: true,
        });
    };

    return (
        <InstagramLayout>
            <Head title="Edit profile • FreeCodeGram" />

            <div className="max-w-xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Link href={`/u/${user.username}`}>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Edit profile</h1>
                </div>

                <div className="border border-border rounded-2xl bg-card p-6 md:p-8 shadow-xs">
                    {/* Avatar Upload Header */}
                    <div className="flex items-center gap-5 p-4 rounded-xl bg-muted/40 mb-8">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <Avatar className="w-16 h-16 border-2 border-border">
                                {avatarPreview && (
                                    <AvatarImage src={avatarPreview} alt={user.name} />
                                )}
                                <AvatarFallback className="text-lg font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Camera className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="font-bold text-sm">{user.username}</span>
                            <span className="text-xs text-muted-foreground">{user.name}</span>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs font-semibold text-primary hover:underline mt-1 text-left cursor-pointer"
                            >
                                Change photo
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>

                    {errors.image && (
                        <p className="text-xs text-destructive mb-4 -mt-4">
                            {errors.image}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">{errors.name}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div className="grid gap-2">
                            <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Username
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-sm text-muted-foreground font-medium">@</span>
                                <Input
                                    id="username"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    className="pl-7 font-mono text-sm"
                                    required
                                />
                            </div>
                            {errors.username && (
                                <p className="text-xs text-destructive">{errors.username}</p>
                            )}
                            <p className="text-[11px] text-muted-foreground">
                                Your profile will be at freecodegram.test/u/{data.username || 'username'}
                            </p>
                        </div>

                        {/* Professional Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Professional Title / Subtitle
                            </Label>
                            <Input
                                id="title"
                                placeholder="e.g. Software Engineer • Nature Photographer"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            {errors.title && (
                                <p className="text-xs text-destructive">{errors.title}</p>
                            )}
                        </div>

                        {/* Website URL */}
                        <div className="grid gap-2">
                            <Label htmlFor="url" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Website
                            </Label>
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://yourwebsite.com"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                            />
                            {errors.url && (
                                <p className="text-xs text-destructive">{errors.url}</p>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="grid gap-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="bio" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Bio
                                </Label>
                                <span className="text-[10px] text-muted-foreground">
                                    {data.bio.length} / 500
                                </span>
                            </div>
                            <textarea
                                id="bio"
                                rows={4}
                                maxLength={500}
                                placeholder="Write a short bio about yourself..."
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                className="w-full text-sm rounded-lg border border-input bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                            />
                            {errors.bio && (
                                <p className="text-xs text-destructive">{errors.bio}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
                            <Link href={`/u/${user.username}`}>
                                <Button type="button" variant="ghost" disabled={processing}>
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="font-semibold">
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-1.5" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </InstagramLayout>
    );
}
