'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/UserContext';
import { Header } from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast({
                title: 'Error',
                description: 'Please fill in all fields',
                variant: 'destructive',
            });
            return;
        }

        if (password.length < 4) {
            toast({
                title: 'Error',
                description: 'Password must be at least 4 characters',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const success = await register(name, email, password);

            if (success) {
                toast({
                    title: 'Account created! ',
                    description: 'Welcome to Techroot.  Start your learning journey!',
                });
                router.push('/dashboard');
            } else {
                toast({
                    title: 'Error',
                    description: 'Could not create account. Please try again.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container max-w-7xl mx-auto px-4 py-20">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Create your account</h1>
                        <p className="text-muted-foreground">
                            Start your coding journey today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Must be at least 4 characters
                            </p>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-foreground underline underline-offset-4 hover:text-foreground/80">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}