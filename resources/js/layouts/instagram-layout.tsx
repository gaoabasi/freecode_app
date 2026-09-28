import { Link, usePage } from '@inertiajs/react';
import {
    Camera,
    Compass,
    Home,
    LogOut,
    Menu,
    Moon,
    PlusSquare,
    Settings,
    Sun,
    User as UserIcon,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import CreatePostModal from '@/components/create-post-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import type { Auth } from '@/types';

interface InstagramLayoutProps {
    children: ReactNode;
}

export default function InstagramLayout({ children }: InstagramLayoutProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth?.user;
    const [createPostOpen, setCreatePostOpen] = useState(false);
    const { appearance, updateAppearance } = useAppearance();

    const username = (user?.username as string) || (user ? `user_${user.id}` : '');
    const avatarUrl = (user?.avatar_url as string) || (user?.avatar as string);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
            {/* Desktop Left Sidebar */}
            <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 w-64 xl:w-72 border-r border-border bg-background/95 backdrop-blur p-4 px-6 select-none">
                {/* Brand Logo */}
                <div className="py-6 px-2">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 font-bold text-2xl tracking-tight hover:opacity-90 transition-opacity"
                    >
                        <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md">
                            <Camera className="w-5 h-5" />
                        </div>
                        <span className="font-serif italic font-bold text-2xl bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                            FreeCodeGram
                        </span>
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 flex flex-col gap-2 mt-4">
                    <Link
                        href="/"
                        className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-muted/60 transition-colors font-medium text-sm group"
                    >
                        <Home className="w-6 h-6 group-hover:scale-105 transition-transform" />
                        <span>Home</span>
                    </Link>

                    <Link
                        href="/explore"
                        className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-muted/60 transition-colors font-medium text-sm group"
                    >
                        <Compass className="w-6 h-6 group-hover:scale-105 transition-transform" />
                        <span>Explore</span>
                    </Link>

                    {user && (
                        <button
                            type="button"
                            onClick={() => setCreatePostOpen(true)}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-muted/60 transition-colors font-medium text-sm text-left w-full group cursor-pointer"
                        >
                            <PlusSquare className="w-6 h-6 group-hover:scale-105 transition-transform text-rose-500" />
                            <span>Create</span>
                        </button>
                    )}

                    {user ? (
                        <Link
                            href={`/u/${username}`}
                            className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-muted/60 transition-colors font-medium text-sm group"
                        >
                            <Avatar className="w-6 h-6 border border-border">
                                {avatarUrl && <AvatarImage src={avatarUrl} alt={user.name} />}
                                <AvatarFallback className="text-[10px]">
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate">Profile</span>
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-muted/60 transition-colors font-medium text-sm group"
                        >
                            <UserIcon className="w-6 h-6" />
                            <span>Log in</span>
                        </Link>
                    )}
                </nav>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-border mt-auto">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left text-sm cursor-pointer">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Menu className="w-5 h-5 text-muted-foreground" />
                                        <span className="font-medium">More</span>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                side="top"
                                className="w-56 mb-2 rounded-xl border-border"
                            >
                                <DropdownMenuItem asChild>
                                    <Link href="/profile/edit-info" className="cursor-pointer">
                                        <UserIcon className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings/profile" className="cursor-pointer">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Account Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        updateAppearance(
                                            appearance === 'dark' ? 'light' : 'dark'
                                        )
                                    }
                                    className="cursor-pointer"
                                >
                                    {appearance === 'dark' ? (
                                        <>
                                            <Sun className="w-4 h-4 mr-2" />
                                            Light Mode
                                        </>
                                    ) : (
                                        <>
                                            <Moon className="w-4 h-4 mr-2" />
                                            Dark Mode
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="w-full text-destructive focus:text-destructive cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex flex-col gap-2 p-1">
                            <Link href="/login">
                                <Button className="w-full" size="sm">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="outline" className="w-full" size="sm">
                                    Sign up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Top Header */}
            <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur">
                <Link href="/" className="inline-flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm">
                        <Camera className="w-4 h-4" />
                    </div>
                    <span className="font-serif italic font-bold text-xl tracking-tight">
                        FreeCodeGram
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    {user ? (
                        <button
                            type="button"
                            onClick={() => setCreatePostOpen(true)}
                            className="p-1.5 rounded-lg hover:bg-muted text-rose-500 transition-colors"
                        >
                            <PlusSquare className="w-6 h-6" />
                        </button>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" variant="secondary">
                                Log in
                            </Button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 xl:ml-72 pb-20 lg:pb-8 min-h-screen">
                {children}
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around py-2.5 border-t border-border bg-background/95 backdrop-blur">
                <Link href="/" className="p-2 text-foreground/80 hover:text-foreground">
                    <Home className="w-6 h-6" />
                </Link>
                <Link href="/explore" className="p-2 text-foreground/80 hover:text-foreground">
                    <Compass className="w-6 h-6" />
                </Link>
                {user ? (
                    <>
                        <button
                            type="button"
                            onClick={() => setCreatePostOpen(true)}
                            className="p-2 text-rose-500"
                        >
                            <PlusSquare className="w-6 h-6" />
                        </button>
                        <Link href={`/u/${username}`} className="p-2">
                            <Avatar className="w-6 h-6 border border-border">
                                {avatarUrl && <AvatarImage src={avatarUrl} alt={user.name} />}
                                <AvatarFallback className="text-[10px]">
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    </>
                ) : (
                    <Link href="/login" className="p-2">
                        <UserIcon className="w-6 h-6" />
                    </Link>
                )}
            </nav>

            {/* Global Create Post Modal */}
            <CreatePostModal
                open={createPostOpen}
                onOpenChange={setCreatePostOpen}
            />
        </div>
    );
}
