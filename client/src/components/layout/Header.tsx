"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";

import { Code2, Flame, Zap, Menu, X } from "lucide-react";

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
                    <span className="hidden sm:inline">CodeLearn</span>
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
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Zap className="h-4 w-4" />
                                    <span className="font-medium">{xp} XP</span>
                                </div>
                                <div className="text-muted-foreground font-medium">
                                    Lv.{level}
                                </div>
                                {streak > 0 && (
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Flame className="h-4 w-4" />
                                        <span className="font-medium">{streak}</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {user?.name}
                            </span>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
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
