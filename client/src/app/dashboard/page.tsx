'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { StatsDisplay } from '@/components/StatsDisplay';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { PathCard } from '@/components/PathCard';
import { useUser } from '@/context/UserContext';
import { learningPaths, getModuleById } from '@/data/learningPaths';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Dashboard() {
    const { isAuthenticated, user, progress } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    // Find the next suggested module
    const getSuggestedModule = () => {
        for (const path of learningPaths) {
            for (const module of path.modules) {
                if (!progress.completedModules.includes(`${path.id}:${module.id}`)) {
                    return { path, module };
                }
            }
        }
        return null;
    };

    const suggestion = getSuggestedModule();

    // Get current module if in progress
    const currentModule = progress.currentPath && progress.currentModule
        ? getModuleById(progress.currentPath, progress.currentModule)
        : null;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                        <p className="text-muted-foreground">
                            Continue your learning journey and build your skills.
                        </p>
                    </div>

                    {/* Stats */}
                    <StatsDisplay />

                    {/* Continue Learning / Suggested Module */}
                    <div className="border border-border rounded-lg p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            <h2 className="font-semibold">
                                {currentModule ? 'Continue Learning' : 'Suggested For Today'}
                            </h2>
                        </div>

                        {(currentModule || suggestion) ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="font-medium">
                                        {currentModule?.title || suggestion?.module.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {currentModule
                                            ? learningPaths.find(p => p.id === progress.currentPath)?.title
                                            : suggestion?.path.title}
                                    </p>
                                </div>
                                <Button asChild>
                                    <Link href={currentModule
                                        ? `/learn/${progress.currentPath}/${progress.currentModule}`
                                        : `/learn/${suggestion?.path.id}/${suggestion?.module.id}`
                                    }>
                                        {currentModule ? 'Continue' : 'Start'}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground mb-4">
                                    You've completed all available modules. Congratulations!
                                </p>
                                <Button variant="outline" asChild>
                                    <Link href="/playground">Practice in Playground</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Badges */}
                    <BadgeDisplay />

                    {/* Learning Paths */}
                    <div className="space-y-4">
                        <h2 className="font-semibold">Learning Paths</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {learningPaths.map(path => (
                                <PathCard key={path.id} path={path} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}