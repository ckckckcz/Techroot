"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Code2, Flame, Zap, Menu, X, User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { getInitials } from "@/lib/helpers";

const NAV_LINKS = [
    { href: "/paths", label: "Jalur Belajar" },
    { href: "/playground", label: "Playground" },
    { href: "/roadmap", label: "Roadmap" }
];

const StatBadge = ({ icon: Icon, value, label, className }: { icon: React.ElementType; value: number | string; label?: string; className?: string }) => (
    <div className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md ${className}`}>
        <Icon className="h-3.5 w-3.5" />
        <span className="font-semibold text-xs">{value}</span>
        {label && <span className="text-xs opacity-70">{label}</span>}
    </div>
);

const UserDropdown = ({ user, xp, level, streak, onLogout }: { user: any; xp: number; level: number; streak: number; onLogout: () => void }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Avatar className="h-8 w-8 ring-2 ring-border hover:ring-primary transition-all">
                    <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs font-semibold">{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 p-0" align="end" sideOffset={8}>
            <div className="p-4 border-b border-border bg-gradient-to-br from-muted/50 to-transparent">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-sm font-semibold">{getInitials(user?.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{user?.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <StatBadge icon={Zap} value={xp} label="XP" className="bg-primary/10 text-primary" />
                    <StatBadge icon={() => <span className="font-semibold text-xs">Lv.{level}</span>} value="" className="bg-muted" />
                    {streak > 0 && <StatBadge icon={Flame} value={streak} label="hari" className="bg-orange-500/10 text-orange-500" />}
                </div>
            </div>
            <div className="p-2">
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard" className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /><span>Dashboard</span></Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/profile" className="flex items-center gap-2"><User className="h-4 w-4" /><span>Profil</span></Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </div>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2">
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="h-4 w-4 mr-2" /><span>Keluar</span>
                </DropdownMenuItem>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
);

const MobileMenu = ({ isOpen, isAuthenticated, xp, streak, onClose, onLogout }: { isOpen: boolean; isAuthenticated: boolean; xp: number; streak: number; onClose: () => void; onLogout: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl rounded-b-2xl">
            <nav className="container max-w-7xl mx-auto py-4 px-4 flex flex-col gap-4">
                {NAV_LINKS.map(link => (
                    <Link key={link.href} href={link.href} onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
                ))}
                {isAuthenticated ? (
                    <>
                        <Link href="/dashboard" onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                        <div className="flex items-center gap-4 py-2 border-t border-border text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground"><Zap className="h-4 w-4" /><span className="font-medium">{xp} XP</span></div>
                            {streak > 0 && <div className="flex items-center gap-1.5 text-muted-foreground"><Flame className="h-4 w-4" /><span className="font-medium">{streak} hari streak</span></div>}
                        </div>
                        <Button variant="ghost" size="sm" onClick={onLogout} className="w-fit">Keluar</Button>
                    </>
                ) : (
                    <div className="flex flex-col gap-2 pt-2 border-t border-border">
                        <Button variant="ghost" size="sm" asChild><Link href="/login" onClick={onClose}>Masuk</Link></Button>
                        <Button size="sm" asChild><Link href="/register" onClick={onClose}>Mulai Sekarang</Link></Button>
                    </div>
                )}
            </nav>
        </div>
    );
};

export function Header() {
    const { isAuthenticated, user, xp, level, streak, logout } = useUser();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => { logout(); setMobileMenuOpen(false); router.push("/"); };

    return (
        <header className="fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl border-2 border-border bg-white backdrop-blur-xl rounded-b-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
            <div className="mx-auto flex h-16 items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                    <Code2 className="h-6 w-6" /><span className="hidden sm:inline">Techroot</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {isAuthenticated && NAV_LINKS.map(link => (
                        <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <UserDropdown user={user} xp={xp} level={level} streak={streak} onLogout={handleLogout} />
                    ) : (
                        <>
                            <Button variant="ghost" className="hover:bg-gray-100" size="sm" asChild><Link href="/register">Daftar</Link></Button>
                            <Button size="sm" asChild><Link href="/login">Mulai</Link></Button>
                        </>
                    )}
                </div>

                <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(v => !v)}>
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            <MobileMenu isOpen={mobileMenuOpen} isAuthenticated={isAuthenticated} xp={xp} streak={streak} onClose={() => setMobileMenuOpen(false)} onLogout={handleLogout} />
        </header>
    );
}
