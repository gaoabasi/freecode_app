import { useForm } from '@inertiajs/react';
import { ImagePlus, Loader2, Sparkles, X } from 'lucide-react';
import { type ChangeEvent, type FormEvent, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface CreatePostModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreatePostModal({
    open,
    onOpenChange,
}: CreatePostModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
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
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
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

    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            handleClearImage();
            reset();
            clearErrors();
        }
        onOpenChange(isOpen);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/p', {
            forceFormData: true,
            onSuccess: () => {
                handleClose(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-border bg-background">
                <DialogHeader className="px-6 pt-5 pb-3 border-b border-border">
                    <DialogTitle className="text-center font-semibold text-base">
                        Create new post
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Upload a photo and write a caption to share with the community.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    {!previewUrl ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center p-12 text-center cursor-pointer border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors m-6 rounded-xl bg-muted/20"
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
                        <div className="relative aspect-square max-h-[380px] w-full bg-black/90 flex items-center justify-center overflow-hidden">
                            <img
                                src={previewUrl}
                                alt="Post preview"
                                className="w-full h-full object-contain"
                            />
                            <button
                                type="button"
                                onClick={handleClearImage}
                                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
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

                    <div className="p-6 pt-3 flex flex-col gap-3">
                        <div>
                            <label
                                htmlFor="caption"
                                className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block"
                            >
                                Caption
                            </label>
                            <textarea
                                id="caption"
                                rows={3}
                                value={data.caption}
                                onChange={(e) => setData('caption', e.target.value)}
                                placeholder="Write a caption... (e.g. Beautiful sunset at the beach! #nature #photography)"
                                className="w-full text-sm rounded-lg border border-input bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                            />
                            {errors.caption && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.caption}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleClose(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!data.image || processing}
                                className="font-medium"
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
            </DialogContent>
        </Dialog>
    );
}
