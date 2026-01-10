"use client"

import { useEffect, useState } from "react"
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
} from "lucide-react"
import { useUser } from "@/context/UserContext"
import { Header } from "@/components/layout/Header"
import { api } from "@/lib/api"
import type { User } from "@/types"
import { getInitials } from "@/lib/helpers"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
    const router = useRouter()
    const { user: contextUser, xp, level, streak, badges, logout, isAuthenticated, isLoading: authLoading, progress } = useUser()
    const [dbUser, setDbUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

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
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 space-y-6">
                            <Skeleton className="h-80 w-full rounded-3xl" />
                        </div>
                        <div className="lg:col-span-8 space-y-8">
                            <Skeleton className="h-80 w-full rounded-3xl" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const user = dbUser || contextUser
    if (!user) return null

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
                                <div className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 rounded-3xl bg-white p-2 shadow-2xl ring-8 ring-white/10 transition-all duration-700 hover:scale-105 group">
                                    <div className="h-full w-full rounded-2xl overflow-hidden relative bg-slate-50 flex items-center justify-center border border-slate-100 italic transition-transform group-hover:rotate-2">
                                        {user.avatar ? (
                                            <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
                                        ) : (
                                            <span className="text-4xl sm:text-6xl md:text-8xl font-black text-[#2443B0] tracking-tighter drop-shadow-sm">
                                                {getInitials(user.name)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 h-12 w-12 rounded-2xl bg-[#D7FE44] border-4 border-white flex items-center justify-center text-[#1a1a1a] shadow-xl animate-bounce-slow">
                                        <Crown className="w-6 h-6" />
                                    </div>
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
                                        <Button className="w-full rounded-2xl h-14 font-black bg-[#2443B0] hover:bg-[#1a36a9] text-white shadow-xl shadow-[#2443B0]/20 transition-all border-none gap-3">
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

                                <div className="relative z-10 space-y-12">
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

                                    {/* Progress Section - Refined based on image */}
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
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6">
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
        </div>
    )
}
