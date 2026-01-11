'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Loader2, Circle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function GitHubCallback() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Memproses autentikasi GitHub...');
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loginWithGitHub } = useUser();

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const error = searchParams.get('error');
            const errorDescription = searchParams.get('error_description');

            if (error) {
                setStatus('error');
                setMessage(errorDescription || 'Autentikasi GitHub dibatalkan');
                return;
            }

            if (!code) {
                setStatus('error');
                setMessage('Kode autentikasi tidak ditemukan');
                return;
            }

            try {
                const result = await loginWithGitHub(code);

                if (result.success) {
                    setStatus('success');
                    setMessage(result.isNewUser
                        ? 'Akun berhasil dibuat! Mengalihkan ke dashboard...'
                        : 'Login berhasil! Mengalihkan ke dashboard...'
                    );

                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 1500);
                } else {
                    setStatus('error');
                    setMessage(result.message || 'Gagal melakukan autentikasi');
                }
            } catch (err) {
                setStatus('error');
                setMessage('Terjadi kesalahan saat memproses autentikasi');
            }
        };

        handleCallback();
    }, [searchParams, loginWithGitHub, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="bg-white rounded-3xl border-2 border-border p-10 max-w-md w-full mx-4 text-center">
                <div className="mb-6">
                    {status === 'loading' && (
                        <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto animate-pulse">
                            <Loader2 className="h-10 w-10 text-[#2443B0] animate-spin" />
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                            <Circle className="h-10 w-10 text-emerald-500" />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                            <XCircle className="h-10 w-10 text-red-500" />
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    {status === 'loading' && 'Memproses...'}
                    {status === 'success' && 'Berhasil!'}
                    {status === 'error' && 'Gagal'}
                </h1>

                <p className="text-slate-500 mb-6">{message}</p>

                {status === 'error' && (
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-6 py-3 bg-[#2443B0] text-white rounded-xl font-semibold hover:bg-[#1e3895] transition-colors"
                        >
                            Kembali ke Login
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm text-slate-500 hover:text-[#2443B0] transition-colors"
                        >
                            Atau daftar akun baru
                        </Link>
                    </div>
                )}

                {status === 'loading' && (
                    <p className="text-xs text-slate-400 mt-4">
                        Mohon tunggu sebentar...
                    </p>
                )}
            </div>
        </div>
    );
}
