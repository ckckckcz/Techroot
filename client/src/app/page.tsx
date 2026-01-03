import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PathCard } from '@/components/PathCard';
import { CodePlayground } from '@/components/CodePlayground';
import { learningPaths } from '@/data/learningPaths';
import { Header } from '@/components/layout/Header';
import { ArrowRight, Code2, Zap, Target, Sparkles } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
              Learn to code by
              <br />
              <span className="gradient-text">writing code</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Master programming through hands-on practice.  Write real code, get instant feedback, and track your progress.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button size="xl" asChild>
                <Link href="/register">
                  Start Learning Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/playground">Try Playground</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-secondary mx-auto flex items-center justify-center">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Interactive Playground</h3>
              <p className="text-sm text-muted-foreground">
                Write and run JavaScript directly in your browser with instant feedback.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-secondary mx-auto flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">AI-Powered Hints</h3>
              <p className="text-sm text-muted-foreground">
                Get intelligent feedback and suggestions as you code.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-secondary mx-auto flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Earn XP, level up, and maintain streaks to stay motivated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Learning Paths</h2>
              <p className="text-muted-foreground">
                Structured courses to take you from beginner to confident coder.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.map(path => (
                <PathCard key={path.id} path={path} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Playground Preview Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Try It Now</h2>
              <p className="text-muted-foreground">
                Write your first line of code right here.
              </p>
            </div>
            <CodePlayground
              initialCode={`// Try writing some JavaScript! 
const greeting = "Hello, World!";
console.log(greeting);

// Click "Run Code" to see the output`}
              showAIFeedback={false}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to start coding?</h2>
            <p className="text-muted-foreground">
              Join thousands of learners mastering programming through practice.
            </p>
            <Button size="xl" asChild>
              <Link href="/register">
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Code2 className="h-5 w-5" />
              <span className="font-medium">Techroot</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Techroot.  Learn by doing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}