"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

import { WizardStep, RoadmapFormData, RoadmapData, RoadmapNode, ChatMessage } from "@/types/roadmap";
import { PURPOSE_OPTIONS, TRENDING_FIELDS, SKILL_LEVELS, DAILY_TIME_OPTIONS, DURATION_OPTIONS, GOAL_OPTIONS } from "@/constants/roadmap";

// Components
import { WelcomeStep } from "@/components/roadmap/steps/WelcomeStep";
import { PurposeStep } from "@/components/roadmap/steps/PurposeStep";
import { FieldStep } from "@/components/roadmap/steps/FieldStep";
import { LevelStep } from "@/components/roadmap/steps/LevelStep";
import { TimeStep } from "@/components/roadmap/steps/TimeStep";
import { GoalStep } from "@/components/roadmap/steps/GoalStep";
import { ConfirmStep } from "@/components/roadmap/steps/ConfirmStep";
import { GeneratingStep } from "@/components/roadmap/GeneratingStep";
import { ResultView } from "@/components/roadmap/ResultView";
import { RoadmapSidebar } from "@/components/roadmap/RoadmapSidebar";
import { TopicDetailSheet } from "@/components/roadmap/TopicDetailSheet";

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
    const [isLoading, setIsLoading] = useState(false);
    const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);

    // Topic Detail & Tutor state
    const [selectedTopic, setSelectedTopic] = useState<RoadmapNode | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"resources" | "tutor">("resources");
    const [topicMessages, setTopicMessages] = useState<Record<string, ChatMessage[]>>({});
    const [tutorLoading, setTutorLoading] = useState(false);
    const [tutorInput, setTutorInput] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [isLoading, roadmapData, topicMessages]);

    const getStepNumber = (): number => {
        if (step === "generating") return 6;
        const stepOrder: WizardStep[] = ["purpose", "field", "level", "time", "goal", "confirm"];
        const idx = stepOrder.indexOf(step);
        return idx !== -1 ? idx + 1 : 1;
    };

    const nextStep = () => {
        const stepOrder: WizardStep[] = ["welcome", "purpose", "field", "level", "time", "goal", "confirm"];
        const currentIndex = stepOrder.indexOf(step);
        if (currentIndex < stepOrder.length - 1) {
            setStep(stepOrder[currentIndex + 1]);
        }
    };

    const prevStep = () => {
        const stepOrder: WizardStep[] = ["welcome", "purpose", "field", "level", "time", "goal", "confirm"];
        const currentIndex = stepOrder.indexOf(step);
        if (currentIndex > 0) {
            setStep(stepOrder[currentIndex - 1]);
        }
    };

    const generatePrompt = (): string => {
        const purposeLabel = PURPOSE_OPTIONS.find((p) => p.id === formData.purpose)?.label || formData.purpose;
        const fieldLabel = TRENDING_FIELDS.find((f) => f.id === formData.field)?.name || formData.field;
        const levelLabel = SKILL_LEVELS.find((l) => l.id === formData.level)?.label || formData.level;
        const dailyTimeLabel = DAILY_TIME_OPTIONS.find((t) => t.id === formData.dailyTime)?.label || formData.dailyTime;
        const durationLabel = DURATION_OPTIONS.find((d) => d.id === formData.duration)?.label || formData.duration;
        const goalLabel = GOAL_OPTIONS.find((g) => g.id === formData.goal)?.label || formData.goal;

        return `Kamu adalah AI asisten khusus untuk membuat learning roadmap yang personal dan terstruktur.
        
Buatkan roadmap belajar yang sangat detail dalam format JSON (WAJIB JSON VALID).

📌 Profil Learner:
- Tujuan: ${purposeLabel}
- Bidang: ${fieldLabel}
- Level: ${levelLabel}
- Waktu: ${dailyTimeLabel}
- Durasi: ${durationLabel}
- Goal: ${goalLabel}
${formData.additionalInfo ? `- Info tambahan: ${formData.additionalInfo}` : ""}

Output wajib format JSON seperti ini:
{
  "overview": "Ringkasan singkat journey",
  "nodes": [
    {
      "id": "1",
      "title": "HTML Dasar",
      "type": "topic",
      "description": "Penjelasan mendalam tentang topik ini...",
      "resources": [
        {"type": "video", "label": "Tutorial HTML Lengkap", "url": "https://youtube.com/..."},
        {"type": "official", "label": "MDN Web Docs", "url": "https://developer.mozilla.org/..."}
      ]
    },
    {
      "id": "2",
      "title": "Checkpoint: Static Site",
      "type": "checkpoint",
      "description": "Projek yang harus dibuat: Buat landing page sederhana...",
      "resources": []
    }
  ]
}

Berikan roadmap yang komprehensif, urut secara logis dari dasar ke advanced.`;
    };

    const handleGenerateRoadmap = async () => {
        setStep("generating");
        setIsLoading(true);

        const prompt = generatePrompt();

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-techroot.vercel.app";
            const endpoint = `${apiUrl.replace(/\/$/, "")}/api/ai/chat`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: prompt,
                    model: "google/gemma-3-27b-it:free",
                }),
            });

            const data = await response.json();

            if (data.success) {
                try {
                    const content = data.data.reply;
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    const parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : content);
                    setRoadmapData(parsedData);
                    setStep("result");
                } catch (parseErr) {
                    console.error("JSON Parse Error:", parseErr);
                    setRoadmapData({
                        overview: "Maaf, terjadi kesalahan format pada data AI. Silakan coba generate ulang.",
                        nodes: [],
                    });
                    setStep("result");
                }
            } else {
                setStep("confirm");
                alert(`Error: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            setStep("confirm");
            alert("Maaf, terjadi kesalahan saat menghubungi AI.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTutorChat = async () => {
        if (!tutorInput.trim() || !selectedTopic) return;

        const topicId = selectedTopic.id;
        const currentMessages = topicMessages[topicId] || [];
        const newMessages = [...currentMessages, { role: "user" as const, content: tutorInput }];

        setTopicMessages((prev) => ({ ...prev, [topicId]: newMessages }));
        setTutorInput("");
        setTutorLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-techroot.vercel.app";
            const endpoint = `${apiUrl.replace(/\/$/, "")}/api/ai/chat`;

            const prompt = `Kamu adalah AI Tutor khusus untuk topik: "${selectedTopic.title}".
      
Konteks Pembelajaran:
${selectedTopic.description}

Aturan:
1. Jawab hanya hal yang berkaitan dengan topik "${selectedTopic.title}".
2. Jika pertanyaan di luar konteks, tolak dengan sopan dan arahkan kembali ke topik ini.
3. Jelaskan dengan bahasa yang sederhana dan edukatif.

Pertanyaan Pengguna: ${tutorInput}`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: prompt,
                    model: "google/gemma-3-27b-it:free",
                }),
            });

            const data = await response.json();
            if (data.success) {
                setTopicMessages((prev) => ({
                    ...prev,
                    [topicId]: [...newMessages, { role: "assistant", content: data.data.reply }],
                }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setTutorLoading(false);
        }
    };

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
        setRoadmapData(null);
        setSelectedTopic(null);
        setIsDetailOpen(false);
        setTopicMessages({});
        setStep("welcome");
    };

    const canProceed = (): boolean => {
        switch (step) {
            case "welcome": return true;
            case "purpose": return !!formData.purpose;
            case "field": return !!formData.field;
            case "level": return !!formData.level;
            case "time": return !!formData.dailyTime && !!formData.duration;
            case "goal": return !!formData.goal;
            default: return true;
        }
    };

    const updateField = (field: keyof RoadmapFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header />
            <div className="pt-24 pb-20">
                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
                    {step === "welcome" ? (
                        <WelcomeStep onNext={nextStep} />
                    ) : step === "result" ? (
                        <ResultView
                            roadmapData={roadmapData}
                            onReset={resetForm}
                            onViewTopicDetail={(node, tab) => {
                                setSelectedTopic(node);
                                setIsDetailOpen(true);
                                setActiveTab(tab);
                            }}
                        />
                    ) : (
                        <div className="flex flex-col gap-4 lg:gap-8 lg:flex-row items-start">
                            <RoadmapSidebar currentStep={step} getStepNumber={getStepNumber} />

                            <main className="flex-1 w-full">
                                <div className="bg-white rounded-xl border-2 border-border p-5 sm:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] min-h-[500px] lg:min-h-[600px] flex flex-col">
                                    <div className="flex-1">
                                        {step === "purpose" && <PurposeStep value={formData.purpose} onChange={(v) => updateField("purpose", v)} />}
                                        {step === "field" && <FieldStep value={formData.field} onChange={(v) => updateField("field", v)} />}
                                        {step === "level" && <LevelStep value={formData.level} onChange={(v) => updateField("level", v)} />}
                                        {step === "time" && (
                                            <TimeStep
                                                dailyTime={formData.dailyTime}
                                                duration={formData.duration}
                                                onDailyTimeChange={(v) => updateField("dailyTime", v)}
                                                onDurationChange={(v) => updateField("duration", v)}
                                            />
                                        )}
                                        {step === "goal" && (
                                            <GoalStep
                                                value={formData.goal}
                                                additionalInfo={formData.additionalInfo}
                                                onChange={(v) => updateField("goal", v)}
                                                onAdditionalInfoChange={(v) => updateField("additionalInfo", v)}
                                            />
                                        )}
                                        {step === "confirm" && <ConfirmStep formData={formData} />}
                                        {step === "generating" && <GeneratingStep />}
                                    </div>

                                    {step !== "generating" && (
                                        <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
                                            <Button
                                                variant="ghost"
                                                size="lg"
                                                onClick={prevStep}
                                                disabled={step === "purpose"}
                                                className="rounded-xl px-6 h-12 font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 gap-2 cursor-pointer"
                                            >
                                                <ArrowLeft className="h-5 w-5" />
                                                Sebelumnya
                                            </Button>
                                            <Button
                                                size="lg"
                                                onClick={step === "confirm" ? handleGenerateRoadmap : nextStep}
                                                disabled={!canProceed()}
                                                className={cn(
                                                    "rounded-xl px-4 h-12 font-black shadow-lg transition-all gap-2 cursor-pointer",
                                                    step === "confirm"
                                                        ? "bg-[#D7FE44] text-[#1a1a1a] hover:bg-[#c4ea3d] hover:scale-105"
                                                        : "bg-[#2443B0] text-white hover:bg-[#1a36a9]"
                                                )}
                                            >
                                                {step === "confirm" ? "Selesaikan & Build" : "Langkah Berikutnya"}
                                                <ArrowRight className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </main>
                        </div>
                    )}
                </div>
            </div>

            <TopicDetailSheet
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                topic={selectedTopic}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                messages={selectedTopic ? (topicMessages[selectedTopic.id] || []) : []}
                tutorInput={tutorInput}
                onTutorInputChange={setTutorInput}
                onTutorSend={handleTutorChat}
                tutorLoading={tutorLoading}
            />

            <style jsx global>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}