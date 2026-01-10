"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
    Mail,
    MapPin,
    Zap,
    Trophy,
    Flame,
    Settings,
    LogOut,
    ChevronRight,
    ShieldCheck,
    BookOpen,
    Target,
    Activity,
    Award,
    Star,
    Crown,
    User as UserIcon,
    School,
    Camera,
    Loader2,
} from "lucide-react"
import { useUser } from "@/context/UserContext"
import { Header } from "@/components/layout/Header"
import { api } from "@/lib/api"
import type { User } from "@/types"
import { getInitials } from "@/lib/helpers"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
    const router = useRouter()
    const { user: contextUser, xp, level, streak, badges, logout, isAuthenticated, isLoading: authLoading, progress, updateUser } = useUser()
    const [dbUser, setDbUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const { toast } = useToast()

    // Handle Responsive Check
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login")
        }
    }, [authLoading, isAuthenticated, router])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api<{ success: boolean; data: { user: User } }>("/api/auth/me")
                if (response.success && response.data.user) {
                    setDbUser(response.data.user)
                }
            } catch (error) {
                console.error("Failed to fetch user from DB:", error)
            } finally {
                setLoading(false)
            }
        }

        if (isAuthenticated) {
            fetchUser()
        }
    }, [isAuthenticated])

    if (authLoading || (loading && !dbUser)) {
        return (
            <div className="min-h-screen bg-[#FDFDFF]">
                <Header />
                <div className="container max-w-6xl mx-auto px-4 py-32 space-y-8">
                    <Skeleton className="h-64 md:h-96 w-full rounded-3xl" />
                    <div className="grid lg:grid-cols-12 gap-8 lg:items-stretch items-start">
                        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
                            <Skeleton className="h-80 w-full rounded-3xl" />
                        </div>
                        <div className="lg:col-span-8 w-full">
                            <Skeleton className="h-80 w-full rounded-3xl" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const user = dbUser || contextUser
    if (!user) return null

    const AVATAR_OPTIONS = [
        "https://api.dicebear.com/9.x/thumbs/svg?seed=Alexander",
        "https://api.dicebear.com/9.x/thumbs/svg?seed=Aidan",
        "https://api.dicebear.com/9.x/thumbs/svg?seed=Jameson",
        "https://api.dicebear.com/9.x/thumbs/svg?seed=Andrea",
        "https://api.dicebear.com/9.x/thumbs/svg?seed=Nolan",
        "https://api.dicebear.com/9.x/thumbs/svg?seed=Emery",
        "https://api.dicebear.com/9.x/thumbs/svg?seed=Sara",
        "https://api.dicebear.com/9.x/thumbs/svg?seed=Amaya",
    ]

    const EditProfileForm = ({ onUpdateSuccess }: { onUpdateSuccess: () => void }) => {
        const [formData, setFormData] = useState({
            name: user.name,
            institution: user.institution || "",
            avatar: user.avatar || AVATAR_OPTIONS[0],
        })
        const [isSubmitting, setIsSubmitting] = useState(false)

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            setIsSubmitting(true)
            try {
                const response = await api<{ success: boolean; message: string; data: { user: User } }>("/api/auth/update", {
                    method: "PUT",
                    body: formData,
                })

                if (response.success) {
                    updateUser(response.data.user)
                    setDbUser(response.data.user)
                    toast({
                        title: "Berhasil!",
                        description: "Profil Anda telah diperbarui.",
                    })
                    onUpdateSuccess()
                } else {
                    toast({
                        variant: "destructive",
                        title: "Gagal",
                        description: response.message || "Gagal memperbarui profil.",
                    })
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Kesalahan",
                    description: "Terjadi kesalahan sistem.",
                })
            } finally {
                setIsSubmitting(false)
            }
        }

        return (
            <form onSubmit={handleSubmit} className="space-y-8 pt-4">
                {/* Avatar Selection */}
                <div className="space-y-4">
                    <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Pilih Avatar</Label>
                    <div className="grid grid-cols-4 gap-4">
                        {AVATAR_OPTIONS.map((avatarUrl, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setFormData({ ...formData, avatar: avatarUrl })}
                                className={cn(
                                    "relative aspect-square rounded-2xl overflow-hidden border-4 transition-all hover:scale-105",
                                    formData.avatar === avatarUrl
                                        ? "border-[#2443B0] bg-blue-50 shadow-lg shadow-[#2443B0]/10"
                                        : "border-transparent bg-slate-50 hover:border-slate-200"
                                )}
                            >
                                <img
                                    src={avatarUrl}
                                    alt={`Avatar ${idx}`}
                                    className="w-full h-full object-cover p-1"
                                />
                                {formData.avatar === avatarUrl && (
                                    <div className="absolute inset-0 bg-[#2443B0]/10 flex items-center justify-center">
                                        <div className="bg-[#2443B0] text-white rounded-full p-1">
                                            <ShieldCheck className="w-3 h-3" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-black uppercase tracking-widest text-slate-400">Nama Lengkap</Label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="pl-12 h-14 rounded-2xl border-2 border-slate-100 focus:border-[#2443B0] focus:ring-0 transition-all font-bold"
                                placeholder="Masukkan nama Anda"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="institution" className="text-sm font-black uppercase tracking-widest text-slate-400">Institusi / Universitas</Label>
                        <div className="relative">
                            <School className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                id="institution"
                                value={formData.institution}
                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                className="pl-12 h-14 rounded-2xl border-2 border-slate-100 focus:border-[#2443B0] focus:ring-0 transition-all font-bold"
                                placeholder="Nama Sekolah atau Universitas"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-2xl bg-[#2443B0] hover:bg-[#1a36a9] text-white font-black shadow-xl shadow-[#2443B0]/20 transition-all gap-3"
                    >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                        Simpan Perubahan
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-[#2443B0]/10 selection:text-[#2443B0]">
            <Header />

            <main className="pt-24 pb-20 md:pt-32 md:pb-32">
                {/* Banner & Profile Section */}
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="relative">
                        {/* Blue Banner */}
                        <div className="h-64 sm:h-80 md:min-h-[400px] w-full rounded-3xl bg-[#2443B0] overflow-hidden shadow-2xl relative flex flex-col items-center justify-center text-center px-4 py-12 md:py-20">
                            {/* Patterns */}
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                                    backgroundSize: "40px 40px",
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10" />

                            {/* Avatar */}
                            <div className="relative z-10 mb-6">
                                <div className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 rounded-3xl bg-white p-2 shadow-2xl ring-8 ring-white/10 transition-all duration-700 hover:scale-105 group relative">
                                    <div className="h-full w-full rounded-2xl overflow-hidden relative bg-slate-50 flex items-center justify-center border border-slate-100 italic transition-transform group-hover:rotate-2">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl sm:text-6xl md:text-8xl font-black text-[#2443B0] tracking-tighter drop-shadow-sm">
                                                {getInitials(user.name)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 h-12 w-12 rounded-2xl bg-[#D7FE44] border-4 border-white flex items-center justify-center text-[#1a1a1a] shadow-xl animate-bounce-slow z-20">
                                        <Crown className="w-6 h-6" />
                                    </div>
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="absolute inset-0 z-10 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center text-white"
                                    >
                                        <Camera className="w-8 h-8" />
                                    </button>
                                </div>
                            </div>

                            {/* User Name & Email */}
                            <div className="relative z-10 space-y-2">
                                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-lg">
                                    {user.name}
                                </h1>
                                <p className="text-white/60 text-lg sm:text-xl md:text-2xl font-bold italic tracking-tight bg-white/5 backdrop-blur-sm px-4 py-1 rounded-full inline-block">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Content Section */}
                <div className="container max-w-7xl mx-auto px-4 mt-12 sm:mt-16 md:mt-20">
                    <div className="grid lg:grid-cols-12 gap-8 md:gap-10 lg:items-stretch items-start">

                        {/* LEFT COLUMN: Stats & Actions */}
                        <div className="lg:col-span-4 flex flex-col gap-8 w-full">

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4 group hover:border-[#2443B0]/20 hover:shadow-2xl transition-all duration-500">
                                    <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2443B0] group-hover:bg-[#2443B0] group-hover:text-white transition-all shadow-inner">
                                        <Zap className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 leading-none">
                                            {xp || user.xp || 0}
                                        </p>
                                        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                            Total XP
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4 group hover:border-orange-200 hover:shadow-2xl transition-all duration-500">
                                    <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
                                        <Flame className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 leading-none">
                                            {streak || user.streak || 0}
                                        </p>
                                        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                            Streak
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Card & Actions */}
                            <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl overflow-hidden group flex-grow flex flex-col">
                                <div className="p-8 flex flex-col h-full space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black tracking-tight">Status Belajar</h3>
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white transition-all cursor-default">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                                    <Target className="h-6 w-6 text-[#2443B0]" />
                                                </div>
                                                <span className="font-black text-slate-600">Leaderboard</span>
                                            </div>
                                            <span className="font-black text-[#2443B0] text-xl">Top 5%</span>
                                        </div>
                                        <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white transition-all cursor-default">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                                    <Award className="h-6 w-6 text-green-500" />
                                                </div>
                                                <span className="font-black text-slate-600">Sertifikat</span>
                                            </div>
                                            <span className="font-black text-slate-900 text-xl">{badges?.length || 0}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 flex flex-col gap-4">
                                        <Button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="w-full rounded-2xl h-14 font-black bg-[#2443B0] hover:bg-[#1a36a9] text-white shadow-xl shadow-[#2443B0]/20 transition-all border-none gap-3"
                                        >
                                            <Settings className="h-5 w-5" /> Edit Profil
                                        </Button>
                                        <Button
                                            onClick={logout}
                                            variant="ghost"
                                            className="w-full rounded-2xl h-14 font-black text-red-500 hover:bg-red-50 hover:text-red-600 transition-all gap-3"
                                        >
                                            <LogOut className="h-5 w-5" /> Keluar Akun
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Focus Area Mastery */}
                        <div className="lg:col-span-8 w-full">
                            <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-2xl p-8 sm:p-12 md:p-16 relative overflow-hidden group/mastery h-full">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-[#2443B0]/5 rounded-full blur-[120px] -mr-32 -mt-32 group-hover/mastery:bg-[#2443B0]/10 transition-all duration-1000" />

                                <div className="relative z-10 space-y-12 flex flex-col h-full">
                                    <div className="flex flex-col sm:flex-row lg:items-center justify-between gap-10">
                                        <div className="space-y-5">
                                            <div className="inline-flex items-center px-5 py-2 rounded-full bg-blue-50 text-[#2443B0] text-xs font-black uppercase tracking-[0.3em] border border-blue-100">
                                                Mastery Progress
                                            </div>
                                            <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
                                                Level {level} <br /> <span className="text-[#2443B0] not-italic">Dashboard</span>
                                            </h3>
                                            <p className="text-lg text-slate-500 font-bold max-w-sm leading-relaxed">
                                                Terus belajar untuk menguasai teknologi terbaru di Techroot!
                                            </p>
                                        </div>
                                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2rem] bg-[#D7FE44] flex flex-col items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 border-8 border-white flex-shrink-0">
                                            <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter text-[#1a1a1a]/40 mb-1">LV.</span>
                                            <span className="text-5xl md:text-7xl font-black text-[#1a1a1a] leading-none tracking-tight">{level}</span>
                                        </div>
                                    </div>

                                    {/* Progress Section */}
                                    <div className="space-y-8">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6">
                                            <div className="flex items-center gap-5">
                                                <div className="h-14 w-14 rounded-2xl bg-slate-900 text-[#D7FE44] flex items-center justify-center font-black text-lg shadow-2xl shadow-slate-900/30 ring-4 ring-white">
                                                    #{level}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Target Level {level + 1}</span>
                                                    <span className="text-lg font-black text-slate-800 tracking-tight">
                                                        <span className="text-[#2443B0] italic">{(xp || 0) % 200}</span> / 200 <span className="text-slate-400 text-sm">TOTAL XP</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-2 text-xs font-black text-[#2443B0] bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                                                <Star className="w-3 h-3 fill-current" /> SEDANG BERPROGRES
                                            </div>
                                        </div>

                                        <div className="relative h-1 w-full">
                                            <Progress
                                                value={((xp || 0) % 200) / 2}
                                                className="h-10 bg-transparent overflow-hidden"
                                                indicatorClassName="bg-gradient-to-r from-[#2443B0] via-blue-500 to-[#D7FE44] rounded-full shadow-[0_0_30px_rgba(36,67,176,0.4)] transition-all duration-1000 ease-out"
                                            />
                                        </div>
                                    </div>

                                    {/* Stats Summary */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6 mt-auto">
                                        {[
                                            { icon: BookOpen, label: "Courses", val: progress?.completedModules?.length || 0, color: "text-blue-500" },
                                            { icon: Zap, label: "Lessons", val: progress?.completedLessons?.length || 0, color: "text-yellow-500" },
                                            { icon: ShieldCheck, label: "Certs", val: badges?.length || 0, color: "text-green-500" },
                                            { icon: Flame, label: "Daily", val: streak > 5 ? "High" : "Mid", color: "text-orange-500" }
                                        ].map((s, i) => (
                                            <div key={i} className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-100 group/stat hover:bg-white hover:border-[#2443B0]/10 transition-all duration-500">
                                                <s.icon className={`h-6 w-6 ${s.color} mb-4 transition-transform group-hover/stat:scale-110`} />
                                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.val}</p>
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Desktop Edit Modal */}
            <Dialog open={!isMobile && isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-[2.5rem] p-8">
                    <DialogHeader className="space-y-3 pb-4">
                        <DialogTitle className="text-3xl font-black tracking-tight text-[#2443B0]">Edit Profil</DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold">
                            Perbarui informasi profil Anda untuk pengalaman belajar yang lebih personal.
                        </DialogDescription>
                    </DialogHeader>
                    <EditProfileForm onUpdateSuccess={() => setIsEditModalOpen(false)} />
                </DialogContent>
            </Dialog>

            {/* Mobile/Tablet Bottom Sheet */}
            <Sheet open={isMobile && isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <SheetContent side="bottom" className="rounded-t-[3rem] border-none shadow-2xl p-8 pb-12 focus:outline-none">
                    <SheetHeader className="space-y-2 pb-4 text-left">
                        <SheetTitle className="text-3xl font-black tracking-tight text-[#2443B0]">Edit Profil</SheetTitle>
                        <SheetDescription className="text-slate-500 font-bold">
                            Perbarui informasi profil Anda di sini.
                        </SheetDescription>
                    </SheetHeader>
                    <EditProfileForm onUpdateSuccess={() => setIsEditModalOpen(false)} />
                </SheetContent>
            </Sheet>
        </div>
    )
}
