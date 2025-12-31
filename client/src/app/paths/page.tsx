import { Header } from '@/components/layout/Header';
import { PathCard } from '@/components/PathCard';
import { learningPaths } from '@/data/learningPaths';

export default function Paths() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Learning Paths</h1>
                        <p className="text-muted-foreground">
                            Choose a path and start building your coding skills step by step.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {learningPaths.map(path => (
                            <PathCard key={path.id} path={path} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}