"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
    ChevronDown,
    ArrowRight,
    Bot,
    Paperclip,
    Image as ImageIcon,
    X,
    FileText,
    User,
    Mic,
    Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const ModelIcon = ({ brand, color, className }: { brand: string, color: string, className?: string }) => {
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
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5153-4.9066 6.0462 6.0462 0 0 0-4.7471-3.1243 5.9847 5.9847 0 0 0-5.9114 2.8106 5.9847 5.9847 0 0 0-5.3619 1.5767 6.0462 6.0462 0 0 0-1.2581 5.5034 5.9847 5.9847 0 0 0-.5153 4.9066 6.0462 6.0462 0 0 0 4.7471 3.1243 5.3418 5.3418 0 0 0 1.2581.1488 5.9847 5.9847 0 0 0 4.6533-2.1931 5.9847 5.9847 0 0 0 5.3619-1.5767 6.0462 6.0462 0 0 0 1.2581-5.5034 5.9847 5.9847 0 0 0 .5847-.7915zM12 14.8647a2.8617 2.8617 0 0 1-2.4776-1.4285l3.8994-2.2533a.6253.6253 0 0 0 .3126-.5414V5.4190l3.053 1.7631a.0051.0051 0 0 1 .0026.0044v7.6782zm-2.8143-1.0182l-3.8994-2.2533a.0051.0051 0 0 1-.0026-.0044V3.903l3.053 1.7631a.6253.6253 0 0 0 .6252 0l3.8994-2.2533v4.4996a.6253.6253 0 0 0 .3126.5414l3.8994 2.2533zm-4.143 5.617a.0051.0051 0 0 1-.0026-.0044V11.7809l3.053 1.7631a.6305.6305 0 0 0 .3126.0845.6253.6253 0 0 0 .3126-.0845l3.8994-2.2533v4.4996a.6253.6253 0 0 0 .3126.5414l-3.8994 2.2533zm11.9143-7.6782l-3.053-1.7631a.6305.6305 0 0 0-.3126-.0845.6253.6253 0 0 0-.3126.0845l-3.8994 2.2533V7.669a.6253.6253 0 0 0-.3126-.5414l-3.8994-2.2533L12 3.1112l3.053 1.7631a.0051.0051 0 0 1 .0026.0044zm2.143-4.4996a.6253.6253 0 0 0-.3126-.5414l-3.8994-2.2533V3.1112l3.8994 2.2533a.0051.0051 0 0 1 .0026.0044v7.6782l-3.053-1.7631a.6253.6253 0 0 0-.6252 0l-3.8994 2.2533V4.0247zm-5.143 14.8647l-3.053-1.7631a.0051.0051 0 0 1-.0026-.0044v-7.6782l3.8994 2.2533a.6253.6253 0 0 0 .6252 0l3.8994-2.2533v4.4996a.6253.6253 0 0 0-.3126.5414z" />
                </svg>
            );
        default:
            return <Cpu className={className} style={{ color }} />;
    }
};

export const AIStarterPage = () => {
    const [inputValue, setInputValue] = useState("");
    const [selectedModel, setSelectedModel] = useState(requestedModels[0]);
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const message = inputValue.trim();
        if (!message && uploadedFiles.length === 0) return;

        const newMessages = [...messages, { role: "user", content: message } as const];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const endpoint = `${apiUrl}/api/ai/chat`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    model: selectedModel.id,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.data.reply }]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: `Error: ${data.message}` },
                ]);
            }
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Maaf, terjadi kesalahan saat menghubungi AI." },
            ]);
        } finally {
            setIsLoading(false);
            if (textareaRef.current) textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
        }
        e.target.value = "";
    };

    const removeFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 200) + "px";
        }
    };

    return (
        <div className="relative flex flex-col h-screen w-full bg-white overflow-hidden">
            {/* Background design */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute bottom-0 left-0 right-0 h-[60%]"
                    style={{
                        background:
                            "linear-gradient(to top, rgba(36, 67, 176, 0.08) 0%, rgba(59, 130, 246, 0.05) 30%, transparent 100%)",
                    }}
                />
                <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[400px] bg-blue-300/20 rounded-full blur-[120px]" />
                <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-200/10 rounded-full blur-[100px]" />
            </div>

            {/* Main Layout Container */}
            <div className="bottom-0 left-0 right-0 fixed z-10 flex flex-col h-full w-full overflow-hidden">
                {/* 1. SCROLLABLE CHAT AREA */}
                <div className="flex-1 w-full pb-16 overflow-y-auto scrollbar-hide">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-slate-900 text-center leading-tight mb-6">
                                    <span className="block italic opacity-40 mb-2">Tanya Root.</span>
                                    <span className="block">Kamu Punya Pertanyaan.</span>
                                    <span className="block">Root Punya Jawaban.</span>
                                </h1>
                                <p className="text-slate-500 text-lg md:text-xl text-center max-w-lg">
                                    Tanyakan apapun tentang coding. Debug error. Minta contoh kode.
                                </p>
                            </div>
                        ) : (
                            <div className="py-28 space-y-8">
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
                                                    : "bg-blue-600 border-blue-400 text-white"
                                            )}
                                        >
                                            {msg.role === "user" ? (
                                                <User className="h-5 w-5" />
                                            ) : (
                                                <Bot className="h-5 w-5" />
                                            )}
                                        </div>

                                        <div
                                            className={cn(
                                                "max-w-[80%] rounded-[24px] p-5 shadow-sm transition-all hover:shadow-md",
                                                msg.role === "user"
                                                    ? "bg-[#2443B0] text-white rounded-tr-none"
                                                    : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                                            )}
                                        >
                                            <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed opacity-95">
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex w-full animate-in fade-in duration-300 gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border border-blue-400 animate-pulse">
                                            <Bot className="h-5 w-5 text-white animate-spin-slow" />
                                        </div>
                                        <div className="bg-white border border-slate-100 rounded-[24px] p-5 rounded-tl-none shadow-sm flex flex-col gap-3 min-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" />
                                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                                                    Root sedang merespon
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-2 bg-slate-100 rounded-full w-full animate-pulse" />
                                                <div className="h-2 bg-slate-100 rounded-full w-3/4 animate-pulse delay-75" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="h-[200px] shrink-0" />
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* 2. BOTTOM INPUT AREA */}
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <div
                        className="absolute inset-x-0 bottom-0 h-100 bg-white/40 backdrop-blur-xl border-t border-slate-100 -z-10 mask-gradient-bottom"
                        style={{
                            WebkitMaskImage: "linear-gradient(to top, black 60%, transparent 100%)",
                            maskImage: "linear-gradient(to top, black 60%, transparent 100%)",
                        }}
                    />

                    <div className="pb-16">
                        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                            <form onSubmit={handleSubmit} className="w-full">
                                <div className="bg-white rounded-[24px] shadow-2xl border border-slate-200 p-3 md:p-4 transition-all focus-within:ring-4 focus-within:ring-blue-500/5 group">
                                    {uploadedFiles.length > 0 && (
                                        <div className="flex flex-wrap gap-3 mb-4 px-1">
                                            {uploadedFiles.map((file, index) => {
                                                const isImage = file.type.startsWith("image/");
                                                const previewUrl = isImage ? URL.createObjectURL(file) : null;

                                                return (
                                                    <div
                                                        key={index}
                                                        className="group relative flex flex-col items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-2 transition-all hover:shadow-md animate-in zoom-in-95 duration-200"
                                                    >
                                                        {isImage ? (
                                                            <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-slate-100">
                                                                <img
                                                                    src={previewUrl!}
                                                                    alt={file.name}
                                                                    className="h-full w-full object-cover"
                                                                    onLoad={() => {
                                                                    }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-blue-50/50">
                                                                <FileText className="h-10 w-10 text-blue-500" />
                                                            </div>
                                                        )}

                                                        <span className="text-[10px] text-slate-500 max-w-[96px] truncate font-medium px-1">
                                                            {file.name}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10 scale-90 group-hover:scale-100"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <textarea
                                        ref={textareaRef}
                                        value={inputValue}
                                        onChange={(e) => {
                                            setInputValue(e.target.value);
                                            adjustTextareaHeight();
                                        }}
                                        onKeyDown={handleKeyDown}
                                        disabled={isLoading}
                                        placeholder={
                                            isLoading
                                                ? "Root sedang bekerja..."
                                                : "Apa masalah coding yang sedang kamu hadapi?"
                                        }
                                        rows={1}
                                        className="w-full bg-transparent border-none outline-none text-slate-900 text-base md:text-lg placeholder:text-slate-400 mb-2 px-1 resize-none min-h-[44px] max-h-[200px] py-2 scrollbar-hide"
                                    />

                                    <div className="flex items-center justify-between border-t border-slate-50 pt-2 px-1 pb-1">
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#2443B0] transition-all"
                                                title="Attach file"
                                            >
                                                <Paperclip className="h-5 w-5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => imageInputRef.current?.click()}
                                                className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#2443B0] transition-all"
                                                title="Upload image"
                                            >
                                                <ImageIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#2443B0] transition-all"
                                                title="Voice input"
                                            >
                                                <Mic className="h-5 w-5" />
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                multiple
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                            <input
                                                ref={imageInputRef}
                                                type="file"
                                                multiple
                                                onChange={handleFileUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                                                    className="h-10 px-4 rounded-xl border border-slate-100 flex items-center gap-2 text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all text-sm font-medium"
                                                >
                                                    <ModelIcon
                                                        brand={selectedModel.brand}
                                                        color={selectedModel.color}
                                                        className="h-4 w-4"
                                                    />
                                                    <span className="hidden sm:inline lowercase">
                                                        {selectedModel.name}
                                                    </span>
                                                    <ChevronDown
                                                        className={cn(
                                                            "h-3.5 w-3.5 transition-transform duration-200",
                                                            showModelDropdown && "rotate-180"
                                                        )}
                                                    />
                                                </button>

                                                {showModelDropdown && (
                                                    <div className="absolute bottom-full right-0 mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                                                        <div className="p-2">
                                                            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                                Pilih Model AI
                                                            </div>
                                                            <div className="space-y-1">
                                                                {requestedModels.map((model) => (
                                                                    <button
                                                                        key={model.id}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedModel(model);
                                                                            setShowModelDropdown(false);
                                                                        }}
                                                                        className={cn(
                                                                            "w-full flex items-start gap-4 p-3 rounded-xl text-left transition-all",
                                                                            selectedModel.id === model.id
                                                                                ? "bg-blue-50 text-[#2443B0]"
                                                                                : "hover:bg-slate-50 text-slate-600"
                                                                        )}
                                                                    >
                                                                        <div
                                                                            className={cn(
                                                                                "p-2 rounded-lg",
                                                                                selectedModel.id === model.id
                                                                                    ? "bg-white shadow-sm"
                                                                                    : "bg-slate-100 opacity-60"
                                                                            )}
                                                                        >
                                                                            <ModelIcon
                                                                                brand={model.brand}
                                                                                color={model.color}
                                                                                className="h-4 w-4"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-bold text-sm leading-tight">
                                                                                {model.name}
                                                                            </div>
                                                                            <div className="text-[11px] opacity-60 mt-0.5">
                                                                                {model.description}
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={
                                                    isLoading || (!inputValue.trim() && uploadedFiles.length === 0)
                                                }
                                                className="h-10 w-10 rounded-xl bg-[#2443B0] flex items-center justify-center text-white hover:bg-[#1e3895] transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-blue-500/20 active:scale-95"
                                            >
                                                <ArrowRight className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {showModelDropdown && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setShowModelDropdown(false)}
                />
            )}
        </div>
    );
};