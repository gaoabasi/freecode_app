import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, ImagePlus, Loader2, Sparkles, X } from 'lucide-react';
import { type ChangeEvent, type FormEvent, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import InstagramLayout from '@/layouts/instagram-layout';

export default function CreatePostPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<{
        caption: string;
        image: File | null;
    }>({
        caption: '',
        image: null,
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleClearImage = () => {
        setData('image', null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/p', {
            forceFormData: true,
        });
    };

    return (
        <InstagramLayout>
            <Head title="Create New Post • FreeCodeGram" />

            <div className="max-w-xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Create new post</h1>
                </div>

                <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-xs">
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        {!previewUrl ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center p-14 text-center cursor-pointer border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors m-6 rounded-xl bg-muted/20"
                            >
                                <div className="p-4 rounded-full bg-primary/10 text-primary mb-3">
                                    <ImagePlus className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-medium mb-1">
                                    Drag photos here or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Supports PNG, JPG, WEBP up to 10MB
                                </p>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    Select from computer
                                </Button>
                            </div>
                        ) : (
                            <div className="relative aspect-square max-h-[420px] w-full bg-black/90 flex items-center justify-center overflow-hidden">
                                <img
                                    src={previewUrl}
                                    alt="Post preview"
                                    className="w-full h-full object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={handleClearImage}
                                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {errors.image && (
                            <p className="text-xs text-destructive px-6 pt-2">
                                {errors.image}
                            </p>
                        )}

                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <label
                                    htmlFor="caption"
                                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block"
                                >
                                    Caption
                                </label>
                                <textarea
                                    id="caption"
                                    rows={4}
                                    value={data.caption}
                                    onChange={(e) => setData('caption', e.target.value)}
                                    placeholder="Write a caption... (e.g. Exploring the city streets today 📸✨)"
                                    className="w-full text-sm rounded-lg border border-input bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                                {errors.caption && (
                                    <p className="text-xs text-destructive mt-1">
                                        {errors.caption}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Link href="/">
                                    <Button type="button" variant="ghost" disabled={processing}>
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={!data.image || processing}
                                    className="font-semibold"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sharing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-1.5" />
                                            Share Post
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </InstagramLayout>
    );
}
