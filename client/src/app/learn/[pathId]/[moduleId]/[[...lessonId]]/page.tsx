'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    getModuleById,
    getPathById,
    getLessonById,
    getModuleProgress,
    getNextLesson,
    getPrevLesson
} from '@/data/learningPaths';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { ModuleSidebar } from '@/components/ModuleSidebar';
import { LessonContent } from '@/components/LessonContent';
import { LessonNavigation } from '@/components/LessonNavigation';
import { LearningSidebar } from '@/components/LearningSidebar';
import { ArrowLeft, Search, Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ModuleDetail({
    params
}: {
    params: Promise<{
        pathId: string;
        moduleId: string;
        lessonId?: string[];
    }>
}) {
    const { pathId, moduleId, lessonId: lessonIdArray } = use(params);
    const lessonId = lessonIdArray?.[0];
    const { isAuthenticated, progress, completeLesson, completeModule, setCurrentPosition } = useUser();
    const { toast } = useToast();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const path = pathId ? getPathById(pathId) : undefined;
    const module = pathId && moduleId ? getModuleById(pathId, moduleId) : undefined;

    // Get first lesson if no lessonId
    const currentLessonId = lessonId || module?.sections[0]?.lessons[0]?.id;
    const lesson = pathId && moduleId && currentLessonId
        ? getLessonById(pathId, moduleId, currentLessonId)
        : undefined;

    // Get completed lessons from context
    const completedLessons = progress.completedLessons;

    // Redirect to first lesson if no lessonId in URL
    useEffect(() => {
        if (module && !lessonId && currentLessonId) {
            router.replace(`/learn/${pathId}/${moduleId}/${currentLessonId}`);
        }
    }, [module, lessonId, currentLessonId, pathId, moduleId, router]);

    // Update current position when lesson changes (only once per lesson)
    useEffect(() => {
        if (pathId && moduleId && currentLessonId && isAuthenticated) {
            setCurrentPosition(pathId, moduleId, currentLessonId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathId, moduleId, currentLessonId, isAuthenticated]);

    if (!path || !module) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="h-10 w-10 text-slate-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-slate-900">Module Tidak Ditemukan</h1>
                    <p className="text-slate-500 mb-6">
                        Module yang Anda cari tidak ada.
                    </p>
                    <Button asChild className="bg-[#2443B0] hover:bg-[#1e3895] text-white rounded-full px-6">
                        <Link href="/paths">Lihat Semua Paths</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="h-10 w-10 text-slate-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-slate-900">Lesson Tidak Ditemukan</h1>
                    <Button asChild className="bg-[#2443B0] hover:bg-[#1e3895] text-white rounded-full px-6">
                        <Link href={`/paths/${pathId}`}>Kembali ke Path</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const isLessonCompleted = completedLessons.includes(`${moduleId}:${lesson.id}`);
    const moduleProgress = getModuleProgress(moduleId!, completedLessons);
    const nextLesson = getNextLesson(pathId!, moduleId!, lesson.id);
    const prevLesson = getPrevLesson(pathId!, moduleId!, lesson.id);

    const handleLessonComplete = async () => {
        const lessonKey = `${moduleId}:${lesson.id}`;

        if (!completedLessons.includes(lessonKey)) {
            // Use the new completeLesson function that syncs with backend
            await completeLesson(moduleId!, lesson.id, lesson.xpReward);

            // Check if module is complete
            const newCompletedLessons = [...completedLessons, lessonKey];
            const newProgress = getModuleProgress(moduleId!, newCompletedLessons);
            if (newProgress.percentage === 100) {
                await completeModule(pathId!, moduleId!);
            }

            toast({
                title: '✨ Lesson Selesai!',
                description: `+${lesson.xpReward} XP`,
            });

            // Navigate to next lesson
            if (nextLesson) {
                setTimeout(() => {
                    router.push(`/learn/${pathId}/${moduleId}/${nextLesson.lesson.id}`);
                }, 1000);
            }
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Sidebar - Icons */}
            <LearningSidebar pathTitle={path.title} pathId={pathId!} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-14 border-b border-slate-100 flex items-center justify-between px-4 bg-white shadow-sm">
                    <Link
                        href={`/paths/${pathId}`}
                        className="flex items-center gap-2 text-sm hover:text-[#2443B0] transition-colors text-slate-500"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">{path.title}</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors border border-slate-100">
                            <Search className="h-4 w-4" />
                            <span className="hidden md:inline">Cari modul/konten</span>
                            <kbd className="hidden lg:inline ml-2 px-1.5 py-0.5 text-xs bg-white rounded border border-slate-200 text-slate-400">
                                CTRL /
                            </kbd>
                        </button>

                        {/* Toggle Sidebar */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors lg:hidden border border-slate-100"
                        >
                            {sidebarOpen ? <X className="h-5 w-5 text-slate-600" /> : <Menu className="h-5 w-5 text-slate-600" />}
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Main Lesson Content */}
                    <main className="flex-1 overflow-y-auto pb-20 bg-slate-50/30">
                        <div className="max-w-4xl mx-auto px-6 py-8">
                            <LessonContent
                                lesson={lesson}
                                isCompleted={isLessonCompleted}
                                onComplete={handleLessonComplete}
                            />
                        </div>
                    </main>

                    {/* Right Sidebar - Module Navigation */}
                    <aside className={cn(
                        "transition-all duration-300 border-l border-slate-100 bg-white",
                        sidebarOpen ? "w-80" : "w-0 overflow-hidden",
                        "hidden lg:block"
                    )}>
                        <ModuleSidebar
                            module={module}
                            pathId={pathId!}
                            currentLessonId={lesson.id}
                            completedLessons={completedLessons}
                            progress={moduleProgress.percentage}
                        />
                    </aside>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
                    <div className="absolute right-0 top-0 h-full bg-white shadow-2xl">
                        <div className="flex items-center justify-end p-4 border-b border-slate-100">
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                            >
                                <X className="h-5 w-5 text-slate-600" />
                            </button>
                        </div>
                        <ModuleSidebar
                            module={module}
                            pathId={pathId!}
                            currentLessonId={lesson.id}
                            completedLessons={completedLessons}
                            progress={moduleProgress.percentage}
                        />
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <LessonNavigation
                pathId={pathId!}
                moduleId={moduleId!}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
                currentLessonTitle={lesson.title}
            />
        </div>
    );
}
