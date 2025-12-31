'use client';

import { use } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ModuleCard } from '@/components/ModuleCard';
import { Button } from '@/components/ui/button';
import { getPathById } from '@/data/learningPaths';
import { useUser } from '@/context/UserContext';
import { ArrowLeft, Code2, Lightbulb, Layout } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
    Code2: <Code2 className="h-8 w-8" />,
    Lightbulb: <Lightbulb className="h-8 w-8" />,
    Layout: <Layout className="h-8 w-8" />,
};

export default function PathDetail({ params }: { params: Promise<{ pathId: string }> }) {
    const { pathId } = use(params);
    const { progress } = useUser();

    const path = pathId ? getPathById(pathId) : undefined;

    if (!path) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container max-w-7xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Path Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        The learning path you're looking for doesn't exist.
                    </p>
                    <Button asChild>
                        <Link href="/paths">View All Paths</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Determine module status
    const getModuleStatus = (moduleId: string, index: number): 'locked' | 'active' | 'completed' => {
        const key = `${path.id}:${moduleId}`;

        if (progress.completedModules.includes(key)) {
            return 'completed';
        }

        // First module is always active, others need previous to be completed
        if (index === 0) {
            return 'active';
        }

        const previousModuleKey = `${path.id}:${path.modules[index - 1].id}`;
        if (progress.completedModules.includes(previousModuleKey)) {
            return 'active';
        }

        return 'locked';
    };

    const completedCount = path.modules.filter(m =>
        progress.completedModules.includes(`${path.id}:${m.id}`)
    ).length;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Back Link */}
                    <Link
                        href="/paths"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        All Paths
                    </Link>

                    {/* Path Header */}
                    <div className="mb-8">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center">
                                {iconMap[path.icon] || <Code2 className="h-8 w-8" />}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{path.title}</h1>
                                <p className="text-muted-foreground mt-1">{path.description}</p>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center gap-4 mt-6">
                            <div className="flex-1">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{completedCount}/{path.modules.length} completed</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-foreground rounded-full transition-all duration-300"
                                        style={{ width: `${(completedCount / path.modules.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modules List */}
                    <div className="space-y-4">
                        <h2 className="font-semibold">Modules</h2>
                        <div className="space-y-4">
                            {path.modules.map((module, index) => (
                                <ModuleCard
                                    key={module.id}
                                    module={module}
                                    pathId={path.id}
                                    status={getModuleStatus(module.id, index)}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}