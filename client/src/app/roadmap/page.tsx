"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    ChevronDown,
    ArrowRight,
    Cpu,
    Route,
    Sparkles,
    Target,
    Clock,
    Zap,
    GraduationCap,
    Briefcase,
    BarChart3,
    Code2,
    Rocket,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    User,
    BookOpen,
    Calendar,
    Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";

// ============================================
// DATA DEFINITIONS - Hidden from user (jurusan)
// ============================================

// Jurusan yang tersedia (tidak ditampilkan ke user)
const AVAILABLE_MAJORS = ["Teknik Informatika", "Sistem Informasi"] as const;

// Bidang-bidang yang sedang naik daun untuk Sistem Informasi & Teknik Informatika
const TRENDING_FIELDS = [
    {
        id: "web-dev",
        name: "Web Development",
        icon: Code2,
        description: "Frontend, Backend, atau Fullstack",
        trending: true,
    },
    {
        id: "mobile-dev",
        name: "Mobile Development",
        icon: Rocket,
        description: "Android, iOS, atau Cross-platform",
        trending: true,
    },
    {
        id: "data-science",
        name: "Data Science & AI",
        icon: BarChart3,
        description: "Machine Learning, Deep Learning, Analytics",
        trending: true,
    },
    {
        id: "cloud-devops",
        name: "Cloud & DevOps",
        icon: Zap,
        description: "AWS, Azure, GCP, CI/CD",
        trending: true,
    },
    {
        id: "cybersecurity",
        name: "Cybersecurity",
        icon: Target,
        description: "Security Analyst, Penetration Testing",
        trending: true,
    },
    {
        id: "ui-ux",
        name: "UI/UX Design",
        icon: Sparkles,
        description: "User Research, Prototyping, Design Systems",
        trending: false,
    },
    {
        id: "game-dev",
        name: "Game Development",
        icon: Rocket,
        description: "Unity, Unreal, Game Design",
        trending: false,
    },
    {
        id: "blockchain",
        name: "Blockchain & Web3",
        icon: Code2,
        description: "Smart Contracts, DApps, Crypto",
        trending: false,
    },
];

// Tujuan membuat roadmap
const PURPOSE_OPTIONS = [
    { id: "from-scratch", label: "Mulai dari nol", description: "Belum punya pengalaman sama sekali" },
    { id: "career-switch", label: "Pindah karir", description: "Sudah bekerja tapi ingin switch ke tech" },
    { id: "skill-upgrade", label: "Upgrade skill", description: "Sudah punya dasar, ingin level up" },
    { id: "job-ready", label: "Siap kerja", description: "Ingin segera dapat pekerjaan di bidang ini" },
    { id: "freelance", label: "Jadi freelancer", description: "Ingin memulai karir freelance" },
];

// Level kemampuan
const SKILL_LEVELS = [
    { id: "beginner", label: "Pemula", description: "Belum pernah coding sama sekali", icon: BookOpen },
    { id: "intermediate", label: "Menengah", description: "Sudah paham dasar programming", icon: GraduationCap },
    { id: "advanced", label: "Mahir", description: "Sudah bisa membuat project sendiri", icon: Briefcase },
    { id: "professional", label: "Profesional", description: "Sudah bekerja di industri", icon: Trophy },
];

// Waktu yang dialokasikan per hari
const DAILY_TIME_OPTIONS = [
    { id: "1-2", label: "1-2 jam/hari", hours: 1.5 },
    { id: "2-4", label: "2-4 jam/hari", hours: 3 },
    { id: "4-6", label: "4-6 jam/hari", hours: 5 },
    { id: "6+", label: "6+ jam/hari (fulltime)", hours: 7 },
];

// Durasi belajar
const DURATION_OPTIONS = [
    { id: "1-month", label: "1 bulan", months: 1 },
    { id: "3-months", label: "3 bulan", months: 3 },
    { id: "6-months", label: "6 bulan", months: 6 },
    { id: "12-months", label: "12 bulan", months: 12 },
];

// Target pencapaian
const GOAL_OPTIONS = [
    { id: "portfolio", label: "Membangun portfolio", description: "Punya 3-5 project untuk ditunjukkan" },
    { id: "first-job", label: "Dapat pekerjaan pertama", description: "Siap interview dan dapat offer" },
    { id: "promotion", label: "Naik jabatan", description: "Dari junior ke mid-level atau senior" },
    { id: "certification", label: "Dapat sertifikasi", description: "Sertifikasi profesional yang diakui" },
    { id: "side-income", label: "Penghasilan sampingan", description: "Mulai dapat project freelance" },
];

// AI Models
const requestedModels = [
    {
        id: "google/gemma-3-27b-it:free",
        name: "Gemma 3 27B",
        description: "Google (Terbaru)",
        brand: "google",
        color: "#4285F4"
    },
    {
        id: "openai/gpt-oss-120b:free",
        name: "GPT OSS 120B",
        description: "OpenAI (Free)",
        brand: "openai",
        color: "#10a37f"
    },
    {
        id: "qwen/qwen3-coder:free",
        name: "Qwen 3 Coder",
        description: "Alibaba (Free)",
        brand: "alibaba",
        color: "#ff6a00"
    },
    {
        id: "deepseek/deepseek-r1-0528:free",
        name: "Deepseek R1",
        description: "Deepseek (Free)",
        brand: "deepseek",
        color: "#005696"
    },
];

// ============================================
// TYPES
// ============================================

interface RoadmapFormData {
    purpose: string;
    field: string;
    level: string;
    dailyTime: string;
    duration: string;
    goal: string;
    additionalInfo: string;
}

type WizardStep = "welcome" | "purpose" | "field" | "level" | "time" | "goal" | "confirm" | "generating" | "result";

// ============================================
// COMPONENTS
// ============================================

const ModelIcon = ({ brand, color, className }: { brand: string; color: string; className?: string }) => {
    switch (brand) {
        case "google":
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                </svg>
            );
        case "openai":
            return (
                <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5153-4.9066 6.0462 6.0462 0 0 0-4.7471-3.1243 5.9847 5.9847 0 0 0-5.9114 2.8106 5.9847 5.9847 0 0 0-5.3619 1.5767 6.0462 6.0462 0 0 0-1.2581 5.5034 5.9847 5.9847 0 0 0-.5153 4.9066 6.0462 6.0462 0 0 0 4.7471 3.1243 5.3418 5.3418 0 0 0 1.2581.1488 5.9847 5.9847 0 0 0 4.6533-2.1931 5.9847 5.9847 0 0 0 5.3619-1.5767 6.0462 6.0462 0 0 0 1.2581-5.5034 5.9847 5.9847 0 0 0 .5847-.7915z" />
                </svg>
            );
        default:
            return <Cpu className={className} style={{ color }} />;
    }
};

// Progress indicator component
const ProgressIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
    <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
            <div
                key={i}
                className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i < currentStep
                        ? "bg-[#D7FE44] w-8"
                        : i === currentStep
                            ? "bg-[#2443B0] w-12"
                            : "bg-slate-200 w-8"
                )}
            />
        ))}
    </div>
);

// Radio option component
const RadioOption = ({
    selected,
    onClick,
    children,
    className,
}: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            "w-full p-4 rounded-2xl border-2 text-left transition-all duration-200",
            selected
                ? "border-[#2443B0] bg-[#2443B0]/5 shadow-lg shadow-blue-500/10"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md",
            className
        )}
    >
        <div className="flex items-start gap-4">
            <div
                className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                    selected ? "border-[#2443B0] bg-[#2443B0]" : "border-slate-300"
                )}
            >
                {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            <div className="flex-1">{children}</div>
        </div>
    </button>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function RoadmapPage() {
    const [step, setStep] = useState<WizardStep>("welcome");
    const [formData, setFormData] = useState<RoadmapFormData>({
        purpose: "",
        field: "",
        level: "",
        dailyTime: "",
        duration: "",
        goal: "",
        additionalInfo: "",
    });
    const [selectedModel, setSelectedModel] = useState(requestedModels[0]);
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedRoadmap, setGeneratedRoadmap] = useState("");
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    // Get step number for progress
    const getStepNumber = (): number => {
        const stepOrder: WizardStep[] = ["welcome", "purpose", "field", "level", "time", "goal", "confirm"];
        return stepOrder.indexOf(step);
    };

    // Navigate to next step
    const nextStep = () => {
        const stepOrder: WizardStep[] = ["welcome", "purpose", "field", "level", "time", "goal", "confirm"];
        const currentIndex = stepOrder.indexOf(step);
        if (currentIndex < stepOrder.length - 1) {
            setStep(stepOrder[currentIndex + 1]);
        }
    };

    // Navigate to previous step
    const prevStep = () => {
        const stepOrder: WizardStep[] = ["welcome", "purpose", "field", "level", "time", "goal", "confirm"];
        const currentIndex = stepOrder.indexOf(step);
        if (currentIndex > 0) {
            setStep(stepOrder[currentIndex - 1]);
        }
    };

    // Generate the roadmap prompt
    const generatePrompt = (): string => {
        const purposeLabel = PURPOSE_OPTIONS.find(p => p.id === formData.purpose)?.label || formData.purpose;
        const fieldLabel = TRENDING_FIELDS.find(f => f.id === formData.field)?.name || formData.field;
        const levelLabel = SKILL_LEVELS.find(l => l.id === formData.level)?.label || formData.level;
        const dailyTimeLabel = DAILY_TIME_OPTIONS.find(t => t.id === formData.dailyTime)?.label || formData.dailyTime;
        const durationLabel = DURATION_OPTIONS.find(d => d.id === formData.duration)?.label || formData.duration;
        const goalLabel = GOAL_OPTIONS.find(g => g.id === formData.goal)?.label || formData.goal;

        return `Kamu adalah AI asisten khusus untuk membuat learning roadmap yang personal dan terstruktur.

Buatkan roadmap belajar yang sangat detail berdasarkan profil berikut:

📌 **Profil Learner:**
- Tujuan: ${purposeLabel}
- Bidang yang diminati: ${fieldLabel}
- Level saat ini: ${levelLabel}
- Waktu belajar: ${dailyTimeLabel}
- Durasi target: ${durationLabel}
- Target pencapaian: ${goalLabel}
${formData.additionalInfo ? `- Info tambahan: ${formData.additionalInfo}` : ''}

📋 **Format Roadmap yang dibutuhkan:**

1. **Overview** - Ringkasan singkat tentang journey yang akan ditempuh
2. **Timeline per Minggu/Bulan** - Breakdown detail apa yang harus dipelajari setiap periode
3. **Milestone & Checkpoint** - Target yang harus dicapai di setiap fase
4. **Resource Gratis** - Rekomendasi tutorial, course, dokumentasi gratis
5. **Project Practice** - Ide project untuk latihan di setiap fase
6. **Tips & Motivasi** - Saran untuk tetap konsisten

Gunakan format Markdown yang rapi dengan heading, bullet points, emoji, dan timeline yang jelas.
Buat roadmap ini se-actionable mungkin agar mudah diikuti.`;
    };

    // Submit and generate roadmap
    const handleGenerateRoadmap = async () => {
        setStep("generating");
        setIsLoading(true);

        const prompt = generatePrompt();

        // Show user's summary as a message
        const userSummary = `Saya ingin membuat roadmap untuk ${TRENDING_FIELDS.find(f => f.id === formData.field)?.name}. Tujuan saya adalah ${PURPOSE_OPTIONS.find(p => p.id === formData.purpose)?.label?.toLowerCase()}, dengan level ${SKILL_LEVELS.find(l => l.id === formData.level)?.label?.toLowerCase()}. Saya bisa belajar ${DAILY_TIME_OPTIONS.find(t => t.id === formData.dailyTime)?.label?.toLowerCase()} selama ${DURATION_OPTIONS.find(d => d.id === formData.duration)?.label?.toLowerCase()}.`;

        setMessages([{ role: "user", content: userSummary }]);

        try {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const endpoint = `${apiUrl}/api/ai/chat`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: prompt,
                    model: selectedModel.id,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setGeneratedRoadmap(data.data.reply);
                setMessages(prev => [...prev, { role: "assistant", content: data.data.reply }]);
                setStep("result");
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.message}` }]);
                setStep("result");
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                { role: "assistant", content: "Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi." },
            ]);
            setStep("result");
        } finally {
            setIsLoading(false);
        }
    };

    // Reset and start over
    const resetForm = () => {
        setFormData({
            purpose: "",
            field: "",
            level: "",
            dailyTime: "",
            duration: "",
            goal: "",
            additionalInfo: "",
        });
        setMessages([]);
        setGeneratedRoadmap("");
        setStep("welcome");
    };

    // Check if can proceed to next step
    const canProceed = (): boolean => {
        switch (step) {
            case "welcome":
                return true;
            case "purpose":
                return !!formData.purpose;
            case "field":
                return !!formData.field;
            case "level":
                return !!formData.level;
            case "time":
                return !!formData.dailyTime && !!formData.duration;
            case "goal":
                return !!formData.goal;
            default:
                return true;
        }
    };

    // ============================================
    // RENDER STEPS
    // ============================================

    const renderWelcomeStep = () => (
        <div className="flex-1 flex flex-col items-center justify-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#D7FE44] to-[#a8cc00] flex items-center justify-center shadow-lg shadow-[#D7FE44]/20">
                    <Route className="h-7 w-7 text-slate-900" />
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2443B0] to-[#1e3895] flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Sparkles className="h-7 w-7 text-white" />
                </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 text-center leading-tight mb-4">
                <span className="bg-gradient-to-r from-[#2443B0] via-purple-600 to-[#2443B0] bg-clip-text text-transparent">
                    AI Roadmap Generator
                </span>
            </h1>

            <p className="text-slate-500 text-base sm:text-lg md:text-xl text-center max-w-2xl px-4 mb-10">
                Jawab beberapa pertanyaan singkat dan AI akan membuatkan{" "}
                <span className="text-[#2443B0] font-semibold">learning roadmap personal</span>{" "}
                yang cocok untuk kamu.
            </p>

            <button
                onClick={nextStep}
                className="group px-8 py-4 bg-gradient-to-r from-[#2443B0] to-[#1e3895] text-white rounded-2xl font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
                Mulai Buat Roadmap
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-slate-400 text-sm mt-6">
                ⏱️ Hanya butuh ~2 menit untuk mengisi
            </p>
        </div>
    );

    const renderPurposeStep = () => (
        <div className="flex-1 flex flex-col py-12 animate-in fade-in slide-in-from-right duration-500">
            <ProgressIndicator currentStep={getStepNumber()} totalSteps={6} />

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Untuk apa kamu membuat roadmap?
            </h2>
            <p className="text-slate-500 mb-8">
                Pilih tujuan utama yang paling sesuai dengan kondisimu saat ini
            </p>

            <div className="space-y-3 mb-8">
                {PURPOSE_OPTIONS.map((option) => (
                    <RadioOption
                        key={option.id}
                        selected={formData.purpose === option.id}
                        onClick={() => setFormData(prev => ({ ...prev, purpose: option.id }))}
                    >
                        <div className="font-semibold text-slate-900">{option.label}</div>
                        <div className="text-sm text-slate-500">{option.description}</div>
                    </RadioOption>
                ))}
            </div>
        </div>
    );

    const renderFieldStep = () => (
        <div className="flex-1 flex flex-col py-12 animate-in fade-in slide-in-from-right duration-500">
            <ProgressIndicator currentStep={getStepNumber()} totalSteps={6} />

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Bidang apa yang ingin kamu pelajari?
            </h2>
            <p className="text-slate-500 mb-8">
                Pilih bidang yang paling menarik minatmu
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {TRENDING_FIELDS.map((field) => {
                    const Icon = field.icon;
                    return (
                        <button
                            key={field.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, field: field.id }))}
                            className={cn(
                                "p-4 rounded-2xl border-2 text-left transition-all duration-200 relative",
                                formData.field === field.id
                                    ? "border-[#2443B0] bg-[#2443B0]/5 shadow-lg shadow-blue-500/10"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                            )}
                        >
                            {field.trending && (
                                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#D7FE44] text-slate-900 text-[10px] font-bold rounded-full">
                                    🔥 TRENDING
                                </span>
                            )}
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                    formData.field === field.id
                                        ? "bg-[#2443B0] text-white"
                                        : "bg-slate-100 text-slate-600"
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-slate-900">{field.name}</div>
                                    <div className="text-xs text-slate-500">{field.description}</div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderLevelStep = () => (
        <div className="flex-1 flex flex-col py-12 animate-in fade-in slide-in-from-right duration-500">
            <ProgressIndicator currentStep={getStepNumber()} totalSteps={6} />

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Level kamu saat ini di bidang ini?
            </h2>
            <p className="text-slate-500 mb-8">
                Jujur dalam menilai agar roadmap lebih akurat
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
                {SKILL_LEVELS.map((level) => {
                    const Icon = level.icon;
                    return (
                        <button
                            key={level.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, level: level.id }))}
                            className={cn(
                                "p-5 rounded-2xl border-2 text-center transition-all duration-200",
                                formData.level === level.id
                                    ? "border-[#2443B0] bg-[#2443B0]/5 shadow-lg shadow-blue-500/10"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3",
                                formData.level === level.id
                                    ? "bg-[#2443B0] text-white"
                                    : "bg-slate-100 text-slate-600"
                            )}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="font-semibold text-slate-900">{level.label}</div>
                            <div className="text-xs text-slate-500 mt-1">{level.description}</div>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderTimeStep = () => (
        <div className="flex-1 flex flex-col py-12 animate-in fade-in slide-in-from-right duration-500">
            <ProgressIndicator currentStep={getStepNumber()} totalSteps={6} />

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Berapa waktu yang bisa dialokasikan?
            </h2>
            <p className="text-slate-500 mb-8">
                Tentukan komitmen waktu belajarmu
            </p>

            <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                    <Clock className="w-4 h-4" />
                    Waktu belajar per hari
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {DAILY_TIME_OPTIONS.map((option) => (
                        <RadioOption
                            key={option.id}
                            selected={formData.dailyTime === option.id}
                            onClick={() => setFormData(prev => ({ ...prev, dailyTime: option.id }))}
                        >
                            <div className="font-semibold text-slate-900 text-center">{option.label}</div>
                        </RadioOption>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                    <Calendar className="w-4 h-4" />
                    Durasi belajar
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {DURATION_OPTIONS.map((option) => (
                        <RadioOption
                            key={option.id}
                            selected={formData.duration === option.id}
                            onClick={() => setFormData(prev => ({ ...prev, duration: option.id }))}
                        >
                            <div className="font-semibold text-slate-900 text-center">{option.label}</div>
                        </RadioOption>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderGoalStep = () => (
        <div className="flex-1 flex flex-col py-12 animate-in fade-in slide-in-from-right duration-500">
            <ProgressIndicator currentStep={getStepNumber()} totalSteps={6} />

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Apa target pencapaianmu?
            </h2>
            <p className="text-slate-500 mb-8">
                Pilih goal yang ingin dicapai di akhir perjalanan belajar
            </p>

            <div className="space-y-3 mb-6">
                {GOAL_OPTIONS.map((option) => (
                    <RadioOption
                        key={option.id}
                        selected={formData.goal === option.id}
                        onClick={() => setFormData(prev => ({ ...prev, goal: option.id }))}
                    >
                        <div className="font-semibold text-slate-900">{option.label}</div>
                        <div className="text-sm text-slate-500">{option.description}</div>
                    </RadioOption>
                ))}
            </div>

            <div className="mb-8">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Info tambahan (opsional)
                </label>
                <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                    placeholder="Misalnya: Saya sudah pernah belajar Python dasar, ingin fokus ke React..."
                    className="w-full p-4 border-2 border-slate-200 rounded-xl resize-none h-24 focus:border-[#2443B0] focus:ring-2 focus:ring-[#2443B0]/20 outline-none transition-all"
                />
            </div>
        </div>
    );

    const renderConfirmStep = () => (
        <div className="flex-1 flex flex-col py-12 animate-in fade-in slide-in-from-right duration-500">
            <ProgressIndicator currentStep={getStepNumber()} totalSteps={6} />

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Review & Generate Roadmap
            </h2>
            <p className="text-slate-500 mb-8">
                Pastikan semua informasi sudah benar sebelum generate
            </p>

            <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 mb-6 space-y-4">
                <div className="flex justify-between items-start">
                    <span className="text-slate-500">Tujuan</span>
                    <span className="font-semibold text-slate-900 text-right">
                        {PURPOSE_OPTIONS.find(p => p.id === formData.purpose)?.label}
                    </span>
                </div>
                <div className="flex justify-between items-start">
                    <span className="text-slate-500">Bidang</span>
                    <span className="font-semibold text-slate-900 text-right">
                        {TRENDING_FIELDS.find(f => f.id === formData.field)?.name}
                    </span>
                </div>
                <div className="flex justify-between items-start">
                    <span className="text-slate-500">Level</span>
                    <span className="font-semibold text-slate-900 text-right">
                        {SKILL_LEVELS.find(l => l.id === formData.level)?.label}
                    </span>
                </div>
                <div className="flex justify-between items-start">
                    <span className="text-slate-500">Waktu Belajar</span>
                    <span className="font-semibold text-slate-900 text-right">
                        {DAILY_TIME_OPTIONS.find(t => t.id === formData.dailyTime)?.label}
                    </span>
                </div>
                <div className="flex justify-between items-start">
                    <span className="text-slate-500">Durasi</span>
                    <span className="font-semibold text-slate-900 text-right">
                        {DURATION_OPTIONS.find(d => d.id === formData.duration)?.label}
                    </span>
                </div>
                <div className="flex justify-between items-start">
                    <span className="text-slate-500">Target</span>
                    <span className="font-semibold text-slate-900 text-right">
                        {GOAL_OPTIONS.find(g => g.id === formData.goal)?.label}
                    </span>
                </div>
                {formData.additionalInfo && (
                    <div className="pt-2 border-t border-slate-100">
                        <span className="text-slate-500 block mb-1">Info Tambahan</span>
                        <span className="text-slate-700 text-sm">{formData.additionalInfo}</span>
                    </div>
                )}
            </div>

            {/* Model Selector */}
            <div className="mb-6">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Pilih Model AI
                </label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowModelDropdown(!showModelDropdown)}
                        className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 flex items-center justify-between text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <ModelIcon brand={selectedModel.brand} color={selectedModel.color} className="h-5 w-5" />
                            <span className="font-medium">{selectedModel.name}</span>
                            <span className="text-sm text-slate-400">{selectedModel.description}</span>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", showModelDropdown && "rotate-180")} />
                    </button>

                    {showModelDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-2">
                                {requestedModels.map((model) => (
                                    <button
                                        key={model.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedModel(model);
                                            setShowModelDropdown(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                                            selectedModel.id === model.id
                                                ? "bg-blue-50 text-[#2443B0]"
                                                : "hover:bg-slate-50 text-slate-600"
                                        )}
                                    >
                                        <ModelIcon brand={model.brand} color={model.color} className="h-5 w-5" />
                                        <div>
                                            <div className="font-semibold">{model.name}</div>
                                            <div className="text-xs opacity-60">{model.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleGenerateRoadmap}
                className="w-full py-4 bg-gradient-to-r from-[#D7FE44] to-[#a8cc00] text-slate-900 rounded-2xl font-bold text-lg shadow-xl shadow-[#D7FE44]/25 hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
                <Sparkles className="w-5 h-5" />
                Generate Roadmap
            </button>
        </div>
    );

    const renderGeneratingStep = () => (
        <div className="flex-1 flex flex-col items-center justify-center py-12 animate-in fade-in duration-500">
            <div className="relative mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D7FE44] to-[#a8cc00] flex items-center justify-center shadow-2xl shadow-[#D7FE44]/30 animate-pulse">
                    <Route className="w-10 h-10 text-slate-900" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-[#2443B0]/30 animate-ping" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                Membuat Roadmap Personal...
            </h2>
            <p className="text-slate-500 text-center max-w-md mb-8">
                AI sedang menganalisis profilmu dan menyusun roadmap belajar yang optimal
            </p>

            <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-[#2443B0] animate-spin" />
                <span className="text-sm text-slate-500">Biasanya membutuhkan 10-30 detik</span>
            </div>
        </div>
    );

    const renderResultStep = () => (
        <div className="py-20 sm:py-28 space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {messages.map((msg, i) => (
                <div
                    key={i}
                    className={cn(
                        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500 gap-3",
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                >
                    <div
                        className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md border animate-in zoom-in-50 duration-500",
                            msg.role === "user"
                                ? "bg-white border-blue-100 text-blue-600"
                                : "bg-gradient-to-br from-[#D7FE44] to-[#a8cc00] border-[#D7FE44]/50 text-slate-900"
                        )}
                    >
                        {msg.role === "user" ? (
                            <User className="h-5 w-5" />
                        ) : (
                            <Route className="h-5 w-5" />
                        )}
                    </div>

                    <div
                        className={cn(
                            "max-w-[85%] rounded-[24px] p-5 shadow-sm transition-all hover:shadow-md",
                            msg.role === "user"
                                ? "bg-[#2443B0] text-white rounded-tr-none"
                                : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                        )}
                    >
                        <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                        </div>
                    </div>
                </div>
            ))}

            {/* Action buttons */}
            <div className="flex justify-center gap-4 pt-8">
                <button
                    onClick={resetForm}
                    className="px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Buat Roadmap Baru
                </button>
            </div>

            <div ref={messagesEndRef} />
        </div>
    );

    // ============================================
    // MAIN RENDER
    // ============================================

    return (
        <>
            <Header />
            <div className="relative flex flex-col min-h-screen w-full bg-white overflow-hidden">
                {/* Background design */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(215, 254, 68, 0.05) 0%, rgba(36, 67, 176, 0.08) 50%, rgba(139, 92, 246, 0.05) 100%)",
                        }}
                    />
                    <div className="absolute top-[5%] left-[5%] w-[600px] h-[600px] bg-[#D7FE44]/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px]" />
                    <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-purple-300/10 rounded-full blur-[100px]" />
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex flex-col min-h-screen w-full pt-20 pb-8">
                    <div className="flex-1 w-full overflow-y-auto">
                        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
                            {step === "welcome" && renderWelcomeStep()}
                            {step === "purpose" && renderPurposeStep()}
                            {step === "field" && renderFieldStep()}
                            {step === "level" && renderLevelStep()}
                            {step === "time" && renderTimeStep()}
                            {step === "goal" && renderGoalStep()}
                            {step === "confirm" && renderConfirmStep()}
                            {step === "generating" && renderGeneratingStep()}
                            {step === "result" && renderResultStep()}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    {!["welcome", "confirm", "generating", "result"].includes(step) && (
                        <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 py-4">
                            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between">
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className="px-8 py-3 bg-gradient-to-r from-[#2443B0] to-[#1e3895] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    Lanjut
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Model dropdown overlay */}
                {showModelDropdown && (
                    <div
                        className="fixed inset-0 z-10 bg-transparent"
                        onClick={() => setShowModelDropdown(false)}
                    />
                )}
            </div>
        </>
    );
}
