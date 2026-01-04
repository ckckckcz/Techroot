"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, X, User as UserIcon, MoreHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

interface Message {
    id: string;
    sender: { id: string; name: string; avatar?: string };
    content: string;
    images?: string[];
    timestamp: string | Date;
}

// ==================== SUB-COMPONENTS ====================
const MessageBubble = ({ msg, isMe }: { msg: Message; isMe: boolean }) => {
    const time = typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp;
    return (
        <div className={cn("flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300", isMe ? "flex-row-reverse" : "flex-row")}>
            <Avatar className="h-8 w-8 shrink-0 border border-slate-100 shadow-sm mt-0.5">
                <AvatarImage src={msg.sender.avatar} />
                <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col max-w-[80%]", isMe ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-700">{msg.sender.name}</span>
                    <span className="text-[9px] text-slate-400">{time instanceof Date ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                </div>
                <div className={cn("p-3 rounded-lg shadow-sm text-sm leading-relaxed", isMe ? "bg-[#2443B0] text-white rounded-tr-none" : "bg-white border border-slate-100 text-slate-800 rounded-tl-none")}>
                    {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                    {msg.images && msg.images.length > 0 && (
                        <div className={cn("grid gap-2 mt-2", msg.images.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
                            {msg.images.map((img, i) => <img key={i} src={img} alt="Shared" className="rounded-lg object-cover w-full max-h-48 border border-white/20 shadow-sm" />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ImagePreview = ({ file, index, onRemove }: { file: File; index: number; onRemove: (i: number) => void }) => (
    <div className="relative group animate-in zoom-in-95 duration-200">
        <img src={URL.createObjectURL(file)} alt="preview" className="h-16 w-16 rounded-xl object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-all" />
        <button type="button" onClick={() => onRemove(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
            <X className="h-3.5 w-3.5" />
        </button>
    </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3"><UserIcon className="h-8 w-8 text-slate-300" /></div>
        <p className="text-sm text-slate-500 font-medium">Belum ada pesan</p>
        <p className="text-xs text-slate-400 mt-1">Mulai diskusi dengan mengirim pesan pertama!</p>
    </div>
);

// ==================== MAIN COMPONENT ====================
export const DiscussionForum = ({ moduleId }: { moduleId: string }) => {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!moduleId) return;
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const data = await api<{ success: boolean; data: Message[] }>(`/api/discussions/${moduleId}`);
                if (data.success) setMessages(data.data);
            } catch { } finally { setIsLoading(false); }
        };
        fetchMessages();
    }, [moduleId]);

    useEffect(() => {
        if (!moduleId) return;
        const channel = supabase.channel(`module_discussions:${moduleId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'module_discussions', filter: `module_id=eq.${moduleId}` }, async (payload) => {
                const { data: userData } = await supabase.from('users').select('id, name, avatar').eq('id', payload.new.user_id).single();
                if (userData) {
                    const newMsg: Message = { id: payload.new.id, sender: { id: userData.id, name: userData.name, avatar: userData.avatar }, content: payload.new.content, images: payload.new.images || [], timestamp: payload.new.created_at };
                    setMessages(prev => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg]);
                }
            }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [moduleId]);

    useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!inputValue.trim() && selectedImages.length === 0) || !user) return;
        setIsSending(true);
        try {
            const data = await api<{ success: boolean; data: Message; message?: string }>(`/api/discussions/${moduleId}`, { method: 'POST', body: { content: inputValue, images: [] } });
            if (data.success) { setMessages(prev => [...prev, data.data]); setInputValue(""); setSelectedImages([]); }
            else alert('Gagal mengirim: ' + data.message);
        } catch { alert('Gagal mengirim pesan. Pastikan Anda sudah login.'); }
        finally { setIsSending(false); }
    };

    return (
        <div className="relative w-full h-full bg-slate-50/50">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 px-4 py-3 border-b border-border bg-white flex items-center justify-between z-30">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">Forum Diskusi</h3>
                    <p className="text-[10px] text-muted-foreground">Aktif sekarang • {messages.length + 12} anggota</p>
                </div>
                <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"><MoreHorizontal className="h-4 w-4 text-slate-400" /></button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="absolute top-[57px] bottom-[180px] left-0 right-0 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
                {isLoading ? <div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
                    : messages.length === 0 ? <EmptyState />
                        : messages.map(msg => <MessageBubble key={msg.id} msg={msg} isMe={user?.id === msg.sender.id} />)}
            </div>

            {/* Input */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/80 backdrop-blur-xl border-t border-slate-200/80 z-30 shadow-2xl">
                <form onSubmit={handleSend} className="px-4 py-3 pb-14">
                    {selectedImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 p-2 bg-slate-50/50 rounded-xl border border-slate-100">
                            {selectedImages.map((file, i) => <ImagePreview key={i} file={file} index={i} onRemove={idx => setSelectedImages(prev => prev.filter((_, j) => j !== idx))} />)}
                        </div>
                    )}
                    <div className="relative bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#2443B0]/20 focus-within:border-[#2443B0]">
                        <textarea value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }} placeholder="Tulis pesan Anda..." className="w-full bg-transparent px-4 py-3 pr-24 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none min-h-[52px] max-h-32" rows={1} />
                        <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-[#2443B0] hover:bg-slate-50 rounded-xl transition-all"><ImageIcon className="h-4 w-4" /></button>
                            <div className="w-px h-6 bg-slate-200" />
                            <button type="submit" disabled={!inputValue.trim() && selectedImages.length === 0} className="p-2 bg-[#2443B0] text-white rounded-sm hover:bg-[#1e3895] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"><Send className="h-4 w-4" /></button>
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={e => e.target.files && setSelectedImages(prev => [...prev, ...Array.from(e.target.files!)])} className="hidden" accept="image/*" multiple />
                    <p className="text-[10px] text-center text-slate-400 mt-2.5">Hargai sesama pengguna dalam berdiskusi</p>
                </form>
            </div>
        </div>
    );
};
