import { Suspense } from 'react';

export default function GitHubCallbackLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="h-10 w-10 rounded-full border-4 border-[#2443B0] border-t-transparent animate-spin" />
            </div>
        }>
            {children}
        </Suspense>
    );
}
