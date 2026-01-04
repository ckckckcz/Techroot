"use client";

import React, { useState, useRef, useEffect, KeyboardEvent, FormEvent } from "react";
import { ChevronDown, ArrowRight, Bot, Paperclip, Image as ImageIcon, X, FileText, User, Mic, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIModel, ChatMessage } from "@/types";
import { AI_MODELS, AVAILABLE_MODEL_IMAGES } from "@/constants/ai";
import { api } from "@/lib/api";

// ==================== SUB-COMPONENTS ====================
const ModelIcon = ({ brand, color, className }: { brand: string; color: string; className?: string }) => {
    const [error, setError] = useState(false);
    if (AVAILABLE_MODEL_IMAGES.includes(brand) && !error) {
        return <img src={`/assets/model/${brand}.png`} alt={brand} className={cn("object-contain", className)} onError={() => setError(true)} />;
    }
    return brand === "google" ? <Bot className={className} style={{ color }} /> : <Cpu className={className} style={{ color }} />;
};

const FormattedContent = ({ content }: { content: string }) => (
    <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed opacity-95">
        {content.split(/(\*\*.*?\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**")
                ? <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
                : part
        )}
    </div>
);

const ChatBubble = ({ msg }: { msg: ChatMessage }) => (
    <div className={cn("flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500 gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
        <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md border animate-in zoom-in-50 duration-500", msg.role === "user" ? "bg-white border-blue-100 text-blue-600" : "bg-blue-600 border-blue-400 text-white")}>
            <div className="h-6 w-6 flex items-center justify-center">{msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}</div>
        </div>
        <div className={cn("max-w-[85%] rounded-[24px] px-4 py-3 shadow-sm transition-all hover:shadow-md", msg.role === "user" ? "bg-[#2443B0] text-white rounded-tr-none" : "bg-white border border-slate-100 text-slate-800 rounded-tl-none")}>
            <FormattedContent content={msg.content} />
        </div>
    </div>
);

const LoadingBubble = () => (
    <div className="flex w-full animate-in fade-in duration-300 gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border border-blue-400">
            <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="bg-white border border-slate-100 rounded-[24px] p-5 rounded-tl-none shadow-sm flex flex-col gap-3 min-w-[200px]">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Root sedang merespon</span>
            </div>
            <div className="space-y-2">
                <div className="h-2 bg-slate-100 rounded-full w-full animate-pulse" />
                <div className="h-2 bg-slate-100 rounded-full w-3/4 animate-pulse delay-75" />
            </div>
        </div>
    </div>
);

const WelcomeScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-slate-900 text-center leading-tight mb-6">
            <span className="block italic opacity-40 mb-2">Tanya Root.</span>
            <span className="block">Kamu Punya Pertanyaan.</span>
            <span className="block">Root Punya Jawaban.</span>
        </h1>
        <p className="text-slate-500 text-base sm:text-lg md:text-xl text-center max-w-lg px-4">
            Tanyakan apapun tentang coding. Debug error. Minta contoh kode.
        </p>
    </div>
);

const FilePreview = ({ file, index, onRemove }: { file: File; index: number; onRemove: (i: number) => void }) => {
    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : null;

    return (
        <div className="group relative flex flex-col items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-2 transition-all hover:shadow-md animate-in zoom-in-95 duration-200">
            {isImage ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-slate-100">
                    <img src={previewUrl!} alt={file.name} className="h-full w-full object-cover" />
                </div>
            ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-blue-50/50">
                    <FileText className="h-10 w-10 text-blue-500" />
                </div>
            )}
            <span className="text-[10px] text-slate-500 max-w-[96px] truncate font-medium px-1">{file.name}</span>
            <button type="button" onClick={() => onRemove(index)} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10">
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
};

const ModelDropdown = ({ models, selected, onSelect, isOpen, onToggle }: { models: AIModel[]; selected: AIModel; onSelect: (m: AIModel) => void; isOpen: boolean; onToggle: () => void }) => (
    <div className="relative">
        <button type="button" onClick={onToggle} className="h-10 px-4 rounded-xl border border-slate-100 flex items-center gap-2 text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all text-sm font-medium">
            <ModelIcon brand={selected.brand} color={selected.color} className="h-4 w-4" />
            <span className="hidden sm:inline lowercase">{selected.name}</span>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
        {isOpen && (
            <>
                <div className="fixed inset-0 z-[100] bg-transparent" onClick={onToggle} />
                <div className="absolute bottom-full right-0 mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[101] animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2">
                        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pilih Model AI</div>
                        <div className="space-y-1">
                            {models.map(model => (
                                <button key={model.id} type="button" onClick={() => { onSelect(model); onToggle(); }} className={cn("w-full flex items-start gap-4 p-3 rounded-xl text-left transition-all cursor-pointer group", selected.id === model.id ? "bg-blue-50 text-[#2443B0]" : "hover:bg-slate-50 text-slate-600")}>
                                    <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", selected.id === model.id ? "bg-white shadow-sm" : "bg-slate-100")}>
                                        <ModelIcon brand={model.brand} color={model.color} className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm leading-tight">{model.name}</div>
                                        <div className="text-[11px] opacity-70 mt-0.5">{model.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )}
    </div>
);

// ==================== MAIN COMPONENT ====================
export const AIStarterPage = () => {
    const [inputValue, setInputValue] = useState("");
    const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

    const adjustHeight = () => { if (textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px"; } };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const message = inputValue.trim();
        if (!message && uploadedFiles.length === 0) return;

        setMessages(prev => [...prev, { role: "user", content: message }]);
        setInputValue("");
        setIsLoading(true);

        try {
            const data = await api<{ success: boolean; data?: { reply: string }; message?: string }>('/api/ai/chat', { method: 'POST', body: { message, model: selectedModel.id } });
            setMessages(prev => [...prev, { role: "assistant", content: data.success ? data.data!.reply : `Error: ${data.message}` }]);
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Maaf, terjadi kesalahan saat menghubungi AI." }]);
        } finally {
            setIsLoading(false);
            if (textareaRef.current) textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } };
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) { setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]); } e.target.value = ""; };
    const removeFile = (index: number) => setUploadedFiles(prev => prev.filter((_, i) => i !== index));

    return (
        <div className="relative flex flex-col h-full w-full bg-white overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[60%]" style={{ background: "linear-gradient(to top, rgba(36, 67, 176, 0.08) 0%, rgba(59, 130, 246, 0.05) 30%, transparent 100%)" }} />
                <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[400px] bg-blue-300/20 rounded-full blur-[120px]" />
                <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-200/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col h-full w-full overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 w-full pb-32 overflow-y-auto scrollbar-hide">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
                        {messages.length === 0 ? <WelcomeScreen /> : (
                            <div className="py-20 sm:py-28 space-y-6 sm:space-y-8">
                                {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
                                {isLoading && <LoadingBubble />}
                            </div>
                        )}
                        <div className="h-[200px] shrink-0" />
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="fixed inset-x-0 bottom-0 z-50">
                    <div className="absolute inset-x-0 bottom-0 h-full bg-white/40 backdrop-blur-xl border-t border-slate-100 -z-10" style={{ WebkitMaskImage: "linear-gradient(to top, black 60%, transparent 100%)", maskImage: "linear-gradient(to top, black 60%, transparent 100%)" }} />
                    <div className="absolute inset-x-0 bottom-0 mt-auto">
                        <div className="w-full pb-6 sm:pb-8 md:pb-12 lg:pb-16">
                            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                                <form onSubmit={handleSubmit} className="w-full">
                                    <div className="bg-white rounded-[24px] shadow-2xl border border-slate-200 p-3 md:p-4 transition-all focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-[#2443B0] group">
                                        {uploadedFiles.length > 0 && (
                                            <div className="flex flex-wrap gap-3 mb-4 px-1">
                                                {uploadedFiles.map((file, i) => <FilePreview key={i} file={file} index={i} onRemove={removeFile} />)}
                                            </div>
                                        )}
                                        <textarea ref={textareaRef} value={inputValue} onChange={e => { setInputValue(e.target.value); adjustHeight(); }} onKeyDown={handleKeyDown} disabled={isLoading} placeholder={isLoading ? "Root sedang bekerja..." : "Apa masalah coding yang sedang kamu hadapi?"} rows={1} className="w-full bg-transparent border-none outline-none text-slate-900 text-base md:text-lg placeholder:text-slate-400 mb-2 px-1 resize-none min-h-[44px] max-h-[200px] py-2 scrollbar-hide" />
                                        <div className="flex items-center justify-between border-t border-slate-50 pt-2 px-1 pb-1">
                                            <div className="flex items-center gap-1">
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#2443B0] transition-all" title="Attach file"><Paperclip className="h-5 w-5" /></button>
                                                <button type="button" onClick={() => imageInputRef.current?.click()} className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#2443B0] transition-all" title="Upload image"><ImageIcon className="h-5 w-5" /></button>
                                                <button type="button" className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#2443B0] transition-all" title="Voice input"><Mic className="h-5 w-5" /></button>
                                                <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
                                                <input ref={imageInputRef} type="file" multiple onChange={handleFileUpload} accept="image/*" className="hidden" />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <ModelDropdown models={AI_MODELS} selected={selectedModel} onSelect={setSelectedModel} isOpen={showModelDropdown} onToggle={() => setShowModelDropdown(p => !p)} />
                                                <button type="submit" disabled={isLoading || (!inputValue.trim() && uploadedFiles.length === 0)} className="h-10 w-10 rounded-xl bg-[#2443B0] flex items-center justify-center text-white hover:bg-[#1e3895] transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-blue-500/20 active:scale-95">
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
            </div>
        </div>
    );
};