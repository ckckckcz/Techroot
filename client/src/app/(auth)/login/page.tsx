'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, Github, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGitHubLoading, setIsGitHubLoading] = useState(false);
    const { login, initiateGitHubLogin } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    const handleGitHubLogin = async () => {
        setIsGitHubLoading(true);
        try {
            await initiateGitHubLogin();
        } catch (error) {
            toast({
                title: 'Gagal',
                description: 'Gagal memulai login GitHub.',
                variant: 'destructive',
            });
            setIsGitHubLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                title: 'Gagal Masuk',
                description: 'Harap isi semua bidang input.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const success = await login(email, password);

            if (success) {
                toast({
                    title: 'Selamat Datang Kembali!',
                    description: 'Berhasil masuk ke akun Anda.',
                });
                router.push('/dashboard');
            } else {
                toast({
                    title: 'Gagal Masuk',
                    description: 'Email atau kata sandi salah.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Kesalahan Sistem',
                description: 'Sesuatu berjalan salah. Harap coba lagi.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-[#D7FE44]/30 selection:text-black italic-none">
            {/* Left Side: Interactive Visual Branding (Techroot Blue Theme) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#2443B0] relative overflow-hidden flex-col items-center justify-center p-12 lg:p-16">
                {/* Subtle Gradient Glow instead of Grid */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D7FE44] rounded-full blur-[160px] opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/20 rounded-full blur-[140px] opacity-20 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                {/* Header Node: Glowing Orb & Connection Line */}
                <div className="relative mb-12 flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full border border-white/10 flex items-center justify-center relative bg-white/5 backdrop-blur-sm">
                        <div className="absolute inset-0 rounded-full bg-[#D7FE44]/10 blur-2xl" />
                        <div className="w-38 h-38 rounded-full bg-gradient-to-t from-[#2443B0] via-[#D7FE44] to-white/80 blur-sm animate-pulse-soft opacity-90 shadow-[0_0_50px_rgba(215,254,68,0.4)]" />
                    </div>

                    <div className="h-8 w-px bg-gradient-to-b from-[#D7FE44]/50 to-transparent mt-1" />
                </div>

                {/* Floating Capsule Interaction System */}
                <div className="relative flex justify-center items-center gap-3 py-6 z-10">
                    {/* Label 1: Status */}
                    <div className="h-12 px-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center gap-2 opacity-40">
                        <div className="h-5 w-5 rounded-full border border-[#D7FE44]/30 flex items-center justify-center">
                            <div className="h-1.5 w-2.5 border-b-2 border-r-2 border-[#D7FE44] rotate-45 mb-0.5" />
                        </div>
                        <span className="text-sm font-bold text-white/60">Done</span>
                    </div>

                    {/* Label 2: Main Executing */}
                    <div className="relative group">
                        <div className="h-14 px-7 rounded-full border border-white/20 bg-[#0c0c0c] shadow-2xl flex items-center gap-3 transform transition-all duration-700 hover:-translate-y-1">
                            <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-[#D7FE44] fill-[#D7FE44] animate-pulse" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white">Executing...</span>
                        </div>
                    </div>

                    {/* Label 3: Learn */}
                    <div className="h-12 px-6 rounded-full border border-white/10 bg-white/5 flex items-center gap-3 opacity-60">
                        <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                            <svg className="h-3.5 w-3.5 text-[#D7FE44]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold text-white/80">Learn</span>
                    </div>
                </div>

                {/* Testimonial Quote in Techroot Theme */}
                <div className="mt-16 max-w-lg text-center space-y-8 z-10">
                    <p className="text-xl md:text-2xl font-medium text-white leading-relaxed tracking-tight">
                        "Techroot memberikan pengalaman belajar tercepat yang pernah saya temukan. <span className="text-[#D7FE44] font-bold">Standard industri yang sesungguhnya."</span>
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-12 w-12 rounded-full border-2 border-[#D7FE44]/30 overflow-hidden shadow-lg shadow-[#D7FE44]/10">
                            <Image src="https://i.pravatar.cc/100?u=leo" alt="User" width={48} height={48} />
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold text-white">Leonardo Knight</div>
                            <div className="text-[10px] text-[#D7FE44] uppercase tracking-widest font-bold">Design Lead, Microsoft</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form (Techroot Colors) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 relative bg-white">
                <div className="w-full max-w-md space-y-12">
                    {/* Logo & Header */}
                    <div className="flex justify-center flex-col items-center gap-6">
                        <Link href="/" className="flex items-center gap-2 group transform hover:scale-105 transition-transform">
                            <div className="text-3xl font-black tracking-tighter text-[#2443B0]">techroot</div>
                            <div className="h-2.5 w-2.5 rounded-full bg-[#D7FE44] mt-1" />
                        </Link>
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight text-center leading-tight">Selamat Datang Kembali</h1>
                        <p className="text-center text-slate-500 font-medium -mt-4">Masukkan kredensial Anda untuk mengakses dashboard belajar.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-bold text-slate-900 tracking-tight pl-1">Email Address</Label>
                                <div className="relative group">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="anda@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="h-14 bg-slate-50 border-slate-100 rounded-xl focus:ring-[#2443B0] focus:border-[#2443B0] transition-all font-medium pr-12 group-hover:border-slate-200"
                                        required
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-bold text-slate-900 tracking-tight pl-1">Password</Label>
                                <div className="relative group">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        className="h-14 bg-slate-50 border-slate-100 rounded-xl focus:ring-[#2443B0] focus:border-[#2443B0] transition-all font-medium pr-12 group-hover:border-slate-200"
                                        required
                                    />
                                    <div
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-[#2443B0] transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-14 bg-[#2443B0] hover:bg-[#1e3895] text-white rounded-2xl font-bold text-base transition-all transform active:scale-[0.98] shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 group"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Masuk Sekarang </>}
                            </Button>
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-100"></span>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em] text-slate-300">
                                <span className="bg-white px-4">Atau</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-14 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            onClick={handleGitHubLogin}
                            disabled={isGitHubLoading || isLoading}
                        >
                            {isGitHubLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Github className="h-5 w-5" />} Masuk dengan GitHub
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-slate-500 font-medium">
                                Belum punya akun? <Link href="/register" className="text-[#2443B0] font-bold hover:underline">Daftar Akun Baru</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}