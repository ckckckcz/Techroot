"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, Flame } from "lucide-react"

import { useUser } from "@/context/UserContext"
import { Header } from "@/components/layout/Header"
import { api } from "@/lib/api"
import type { User } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
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

import { ProfileBanner } from "@/components/profile/ProfileBanner"
import { StatCard } from "@/components/profile/StatCard"
import { StatusCard } from "@/components/profile/StatusCard"
import { MasteryDashboard } from "@/components/profile/MasteryDashboard"
import { EditProfileForm } from "@/components/profile/EditProfileForm"

export default function ProfilePage() {
    const router = useRouter()
    const { user: contextUser, xp, level, streak, badges, logout, isAuthenticated, isLoading: authLoading, progress, updateUser } = useUser()
    const [dbUser, setDbUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

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
                <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-32 space-y-8">
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

    const handleUpdateSuccess = (updatedUser: User) => {
        updateUser(updatedUser)
        setDbUser(updatedUser)
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-[#2443B0]/10 selection:text-[#2443B0]">
            <Header />

            <main className="pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-32 md:pb-32">
                <ProfileBanner user={user} onEditClick={() => setIsEditModalOpen(true)} />

                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
                    <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:items-stretch items-start">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8 w-full">
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                <StatCard
                                    icon={Zap}
                                    value={xp || user.xp || 0}
                                    label="Total XP"
                                    variant="blue"
                                />
                                <StatCard
                                    icon={Flame}
                                    value={streak || user.streak || 0}
                                    label="Streak"
                                    variant="orange"
                                />
                            </div>

                            <StatusCard
                                badges={badges}
                                onEditClick={() => setIsEditModalOpen(true)}
                                onLogout={logout}
                            />
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-8 w-full">
                            <MasteryDashboard
                                level={level}
                                xp={xp}
                                progress={progress}
                                badges={badges}
                                streak={streak}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Desktop Edit Modal */}
            <Dialog open={!isMobile && isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl p-8">
                    <DialogHeader className="space-y-3 pb-4">
                        <DialogTitle className="text-3xl font-black tracking-tight text-[#2443B0]">Edit Profil</DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold">
                            Perbarui informasi profil Anda untuk pengalaman belajar yang lebih personal.
                        </DialogDescription>
                    </DialogHeader>
                    <EditProfileForm
                        user={user}
                        onUpdateSuccess={handleUpdateSuccess}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Mobile/Tablet Bottom Sheet */}
            <Sheet open={isMobile && isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <SheetContent
                    side="bottom"
                    className="rounded-t-3xl border-none shadow-2xl p-0 pb-0 focus:outline-none h-[90vh] flex flex-col"
                >
                    <SheetHeader className="text-left p-4 pb-3 border-b border-slate-100 flex-shrink-0">
                        <SheetTitle className="text-2xl sm:text-3xl font-black tracking-tight text-[#2443B0]">Edit Profil</SheetTitle>
                        <SheetDescription className="text-slate-500 font-bold text-sm">
                            Perbarui informasi profil Anda di sini.
                        </SheetDescription>
                    </SheetHeader>
                    <EditProfileForm
                        user={user}
                        onUpdateSuccess={handleUpdateSuccess}
                        onClose={() => setIsEditModalOpen(false)}
                        isMobile={true}
                    />
                </SheetContent>
            </Sheet>
        </div>
    )
}
