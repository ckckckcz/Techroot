'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { learningPaths } from '@/data/learningPaths';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { Search, Code2, Lightbulb, Layout, Sparkles, ArrowRight, BookOpen } from 'lucide-react';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
    Code2: <Code2 className="h-6 w-6" />,
    Lightbulb: <Lightbulb className="h-6 w-6" />,
    Layout: <Layout className="h-6 w-6" />,
};

// Icon background colors
const iconBgColors: Record<string, string> = {
    Code2: 'bg-amber-100',
    Lightbulb: 'bg-orange-100',
    Layout: 'bg-blue-100',
};

// Icon colors
const iconColors: Record<string, string> = {
    Code2: 'text-amber-600',
    Lightbulb: 'text-orange-600',
    Layout: 'text-blue-600',
};

// Categories for sidebar
const categories = [
    { id: 'all', label: 'Semua', count: learningPaths.length },
    { id: 'javascript', label: 'JavaScript', count: 1 },
    { id: 'problem-solving', label: 'Problem Solving', count: 1 },
    { id: 'dom', label: 'DOM Manipulation', count: 1 },
];

export default function Paths() {
    const { progress } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    // Filter paths based on search and category
    const filteredPaths = learningPaths.filter(path => {
        const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            path.description.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeCategory === 'all') return matchesSearch;

        // Map category to path id
        const categoryMap: Record<string, string> = {
            'javascript': 'javascript-fundamentals',
            'problem-solving': 'problem-solving',
            'dom': 'dom-manipulation',
        };

        return matchesSearch && path.id === categoryMap[activeCategory];
    });

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Header />

            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="mt-20">
                    {/* Header Section */}
                    <div className="text-start mb-12">
                        {/* Badges */}
                        <div className="flex items-center justify-start gap-3 mb-6">
                            <div className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full border border-slate-200 text-slate-500 text-sm">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Materi Terstruktur & Interaktif
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
                            Temukan jalur belajar
                        </h1>
                        <h2 className="text-4xl md:text-5xl font-semibolad tracking-tight text-slate-400 mb-8">
                            yang sesuai dengan goals Anda
                        </h2>

                        {/* Search Bar */}
                        <div className="max-w-xl relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari jalur pembelajaran..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2443B0]/20 focus:border-[#2443B0] transition-all"
                            />
                        </div>
                    </div>

                    {/* Main Content - Sidebar + Grid */}
                    <div className="flex gap-8">
                        {/* Left Sidebar - Categories */}
                        <aside className="hidden md:block w-48 flex-shrink-0">
                            <nav className="space-y-1 sticky top-24">
                                {categories.map((category, index) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${activeCategory === category.id
                                            ? 'bg-[#2443B0]/10 text-[#2443B0] font-medium'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className="text-sm text-slate-400 w-5">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-sm">{category.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        {/* Right - Cards Grid */}
                        <div className="flex-1">
                            {filteredPaths.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                        <Search className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        Tidak ada hasil
                                    </h3>
                                    <p className="text-slate-500">
                                        Coba kata kunci lain atau pilih kategori berbeda
                                    </p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filteredPaths.map(path => {
                                        const completed = path.modules.filter((m) =>
                                            progress.completedModules.includes(`${path.id}:${m.id}`)
                                        ).length;
                                        const total = path.modules.length;
                                        const isStarted = completed > 0;

                                        return (
                                            <Link href={`/paths/${path.id}`} key={path.id}>
                                                <div className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-slate-200 transition-all duration-300 h-full flex flex-col">
                                                    {/* Header - Icon & Toggle */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className={`h-12 w-12 rounded-xl ${iconBgColors[path.icon] || 'bg-slate-100'} flex items-center justify-center ${iconColors[path.icon] || 'text-slate-600'}`}>
                                                            {iconMap[path.icon] ?? <Code2 className="h-6 w-6" />}
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-[#2443B0] transition-colors">
                                                        {path.title}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="text-sm text-slate-500 leading-relaxed flex-1">
                                                        {path.description}
                                                    </p>

                                                    {/* Footer - Module count */}
                                                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                                        <span className="text-xs text-slate-400">
                                                            {total} modul • {completed}/{total} selesai
                                                        </span>
                                                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#2443B0] group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
