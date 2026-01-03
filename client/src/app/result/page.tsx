'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import {
    Trophy,
    Star,
    Zap,
    Target,
    Award,
    Home,
    ArrowRight,
    Sparkles,
    BookOpen,
    CheckCircle2
} from 'lucide-react';

// Badge data
const availableBadges = [
    { id: 'first-lesson', name: 'Langkah Pertama', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100', description: 'Menyelesaikan lesson pertama' },
    { id: 'quick-learner', name: 'Pembelajar Cepat', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-100', description: 'Menyelesaikan 5 lesson' },
    { id: 'module-master', name: 'Master Modul', icon: Award, color: 'text-purple-500', bg: 'bg-purple-100', description: 'Menyelesaikan 1 modul' },
    { id: 'streak-warrior', name: 'Pejuang Streak', icon: Target, color: 'text-orange-500', bg: 'bg-orange-100', description: 'Streak 3 hari berturut-turut' },
    { id: 'xp-hunter', name: 'Pemburu XP', icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-100', description: 'Mengumpulkan 100 XP' },
];

export default function ResultPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { xp, level, streak, progress } = useUser();

    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [showConfetti, setShowConfetti] = useState(true);

    // Get params from URL
    const pathId = searchParams.get('pathId') || '';
    const moduleId = searchParams.get('moduleId') || '';
    const xpEarned = parseInt(searchParams.get('xp') || '0');

    // Calculate stats
    const completedLessons = progress.completedLessons.length;
    const completedModules = progress.completedModules.length;

    // Determine earned badges based on progress
    const earnedBadges = availableBadges.filter(badge => {
        switch (badge.id) {
            case 'first-lesson': return completedLessons >= 1;
            case 'quick-learner': return completedLessons >= 5;
            case 'module-master': return completedModules >= 1;
            case 'streak-warrior': return streak >= 3;
            case 'xp-hunter': return xp >= 100;
            default: return false;
        }
    });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });

        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);

        // Stop confetti after 5 seconds
        const timer = setTimeout(() => setShowConfetti(false), 80000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-4">
            {/* Confetti */}
            {showConfetti && windowSize.width > 0 && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={1000}
                    gravity={0.2}
                    colors={['#2443B0', '#D7FE44', '#10B981', '#F59E0B', '#8B5CF6']}
                />
            )}

            <div className="max-w-2xl w-full">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-[#D7FE44] shadow-lg shadow-[#D7FE44]/30 mb-6">
                        <CheckCircle2 className="h-12 w-12 text-slate-900" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Selamat! 🎉
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Kamu telah menyelesaikan lesson dengan sukses
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center shadow-sm">
                        <div className="h-10 w-10 rounded-xl bg-[#2443B0]/10 flex items-center justify-center mx-auto mb-2">
                            <Zap className="h-5 w-5 text-[#2443B0]" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">+{xpEarned}</div>
                        <div className="text-xs text-slate-500">XP Earned</div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center shadow-sm">
                        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
                            <Trophy className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{xp}</div>
                        <div className="text-xs text-slate-500">Total XP</div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center shadow-sm">
                        <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
                            <Star className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">Lv.{level}</div>
                        <div className="text-xs text-slate-500">Level</div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center shadow-sm">
                        <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-2">
                            <Target className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{streak}</div>
                        <div className="text-xs text-slate-500">Day Streak</div>
                    </div>
                </div>

                {/* Progress Summary */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-[#2443B0]" />
                        Progress Belajar
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="text-3xl font-bold text-[#2443B0]">{completedLessons}</div>
                            <div className="text-sm text-slate-500">Lesson Selesai</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="text-3xl font-bold text-[#2443B0]">{completedModules}</div>
                            <div className="text-sm text-slate-500">Modul Selesai</div>
                        </div>
                    </div>
                </div>

                {/* Earned Badges */}
                {earnedBadges.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8 shadow-sm">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-[#D7FE44]" />
                            Badge yang Didapat
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {earnedBadges.map(badge => {
                                const IconComponent = badge.icon;
                                return (
                                    <div
                                        key={badge.id}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                                    >
                                        <div className={`h-10 w-10 rounded-xl ${badge.bg} flex items-center justify-center flex-shrink-0`}>
                                            <IconComponent className={`h-5 w-5 ${badge.color}`} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm text-slate-900">{badge.name}</div>
                                            <div className="text-xs text-slate-500">{badge.description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        asChild
                        className="flex-1 bg-[#2443B0] hover:bg-[#1e3895] text-white rounded-full h-12 text-base font-semibold"
                    >
                        <Link href="/dashboard">
                            <Home className="h-5 w-5 mr-2" />
                            Kembali ke Dashboard
                        </Link>
                    </Button>

                    {pathId && moduleId && (
                        <Button
                            asChild
                            variant="outline"
                            className="flex-1 rounded-full h-12 text-base font-semibold border-slate-200 hover:bg-slate-50"
                        >
                            <Link href={`/paths/${pathId}`}>
                                Lanjut Belajar
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
