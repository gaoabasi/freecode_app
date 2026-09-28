import { Head, Link, usePage } from '@inertiajs/react';
import {
    Camera,
    Compass,
    Heart,
    Lock,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types';

export default function Welcome() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-rose-500 selection:text-white">
            <Head title="FreeCodeGram • Share Your Moments" />

            {/* Navigation Bar */}
            <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md">
                            <Camera className="w-5 h-5" />
                        </div>
                        <span className="font-serif italic font-bold text-2xl tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                            FreeCodeGram
                        </span>
                    </Link>

                    <nav className="flex items-center gap-3">
                        <Link href="/explore">
                            <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
                                <Compass className="w-4 h-4 text-muted-foreground" />
                                <span>Explore</span>
                            </Button>
                        </Link>

                        {user ? (
                            <Link href="/">
                                <Button size="sm" className="font-semibold gap-1.5">
                                    <span>Go to Feed</span>
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="font-medium">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button
                                        size="sm"
                                        className="font-semibold bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:opacity-90 shadow-sm"
                                    >
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="relative overflow-hidden py-16 md:py-24">
                    <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
                        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-rose-500/10 via-purple-500/10 to-amber-500/10 blur-3xl" />
                    </div>

                    <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Pitch */}
                        <div className="flex flex-col gap-6 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 self-center md:self-start px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-medium text-muted-foreground">
                                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                                <span>The Modern Social Media for Creators & Developers</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                                Capture, share & inspire with{' '}
                                <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                                    FreeCodeGram
                                </span>
                            </h1>

                            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                                Share your best photography, code setups, and travel moments.
                                Connect with friends and creators worldwide with a fast, modern experience.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start pt-2">
                                <Link href="/register" className="w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        className="w-full font-semibold bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-90 text-white shadow-md px-8"
                                    >
                                        Create Free Account
                                    </Button>
                                </Link>
                                <Link href="/explore" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="w-full font-semibold">
                                        Browse Public Feed
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="flex items-center gap-6 justify-center md:justify-start text-xs text-muted-foreground pt-4">
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span>Passkey & 2FA Ready</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    <span>React 19 & Inertia v3</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Visual Mockup */}
                        <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]">
                            {/* Outer phone frame */}
                            <div className="relative rounded-[2.5rem] border-8 border-foreground/10 bg-card p-3 shadow-2xl overflow-hidden">
                                {/* Top notch indicator */}
                                <div className="mx-auto h-4 w-28 rounded-full bg-foreground/10 mb-3" />

                                {/* Mock Post Card */}
                                <div className="rounded-2xl border border-border/80 overflow-hidden bg-background">
                                    {/* Mock Post Header */}
                                    <div className="flex items-center gap-2.5 p-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 p-0.5">
                                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold text-[10px]">
                                                G
                                            </div>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-xs leading-none">gao</span>
                                            <span className="text-[10px] text-muted-foreground mt-0.5">Pacific Northwest</span>
                                        </div>
                                    </div>

                                    {/* Mock Post Image */}
                                    <div className="aspect-square w-full bg-muted overflow-hidden relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80"
                                            alt="Showcase post"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Mock Actions */}
                                    <div className="p-3">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                                            <MessageCircle className="w-5 h-5 text-foreground" />
                                        </div>
                                        <p className="font-bold text-xs mb-1">1,482 likes</p>
                                        <p className="text-xs text-foreground/90 leading-tight">
                                            <span className="font-bold mr-1">gao</span>
                                            Misty morning in the Pacific Northwest 🌲⛰️
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Highlights */}
                <section className="py-16 border-t border-border bg-muted/20">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="text-center max-w-xl mx-auto mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                                Everything you love about photo sharing
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Thoughtfully designed for speed, clarity, and community engagement.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                                    <Camera className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-base">Crisp Photo Uploads</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Share high-resolution images with seamless drag-and-drop, instant previews, and custom captions.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-base">Instant Engagement</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Double-tap to like with heart animations, write inline comments, and track what your followers love.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-base">Next-Gen Passkeys & 2FA</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Say goodbye to forgotten passwords. Log in with biometric Face ID, Touch ID, and hardware security keys.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-rose-500" />
                        <span className="font-semibold text-foreground">FreeCodeGram</span>
                    </div>
                    <p>© 2026 FreeCodeGram. Built with Laravel 13, Inertia.js v3, React 19, and Tailwind CSS v4.</p>
                </div>
            </footer>
        </div>
    );
}
