"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Code2,
    Flame,
    Zap,
    Menu,
    X,
    User,
    Settings,
    LayoutDashboard,
    LogOut,
    ChevronDown,
} from "lucide-react";

// Helper function to get user initials
const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

export function Header() {
    const { isAuthenticated, user, xp, level, streak, logout } = useUser();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        router.push("/");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                    <Code2 className="h-6 w-6" />
                    <span className="hidden sm:inline">Techroot</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/paths"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Learning Paths
                    </Link>
                    <Link
                        href="/playground"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Playground
                    </Link>
                    {isAuthenticated && (
                        <Link
                            href="/dashboard"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Dashboard
                        </Link>
                    )}
                </nav>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            {/* Profile Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                        <Avatar className="h-8 w-8 ring-2 ring-border hover:ring-primary transition-all">
                                            <AvatarImage
                                                src={user?.avatar}
                                                alt={user?.name || "User"}
                                            />
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs font-semibold">
                                                {getInitials(user?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-72 p-0"
                                    align="end"
                                    sideOffset={8}
                                >
                                    {/* User Info Header */}
                                    <div className="p-4 border-b border-border bg-gradient-to-br from-muted/50 to-transparent">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                                                <AvatarImage
                                                    src={user?.avatar}
                                                    alt={user?.name || "User"}
                                                />
                                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-sm font-semibold">
                                                    {getInitials(user?.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">
                                                    {user?.name || "User"}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user?.email || "user@example.com"}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Stats Row */}
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-primary/10 text-primary">
                                                <Zap className="h-3.5 w-3.5" />
                                                <span className="font-semibold text-xs">{xp}</span>
                                                <span className="text-xs opacity-70">XP</span>
                                            </div>
                                            <div className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-muted">
                                                <span className="font-semibold text-xs">Lv.{level}</span>
                                            </div>
                                            {streak > 0 && (
                                                <div className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-orange-500/10 text-orange-500">
                                                    <Flame className="h-3.5 w-3.5" />
                                                    <span className="font-semibold text-xs">{streak}</span>
                                                    <span className="text-xs opacity-70">days</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-2">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                <Link href="/dashboard" className="flex items-center gap-2">
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                <Link href="/profile" className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span>Profile</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                <Link href="/settings" className="flex items-center gap-2">
                                                    <Settings className="h-4 w-4" />
                                                    <span>Settings</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </div>

                                    <DropdownMenuSeparator className="m-0" />

                                    {/* Logout */}
                                    <div className="p-2">
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen((v) => !v)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <nav className="container max-w-7xl mx-auto py-4 px-4 flex flex-col gap-4">
                        <Link
                            href="/paths"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Learning Paths
                        </Link>
                        <Link
                            href="/playground"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Playground
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Dashboard
                                </Link>

                                <div className="flex items-center gap-4 py-2 border-t border-border text-sm">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Zap className="h-4 w-4" />
                                        <span className="font-medium">{xp} XP</span>
                                    </div>
                                    {streak > 0 && (
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Flame className="h-4 w-4" />
                                            <span className="font-medium">
                                                {streak} day streak
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="w-fit"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 pt-2 border-t border-border">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
