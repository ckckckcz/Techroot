"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles, Zap, Code2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AIStarterPage = () => {
    const [inputValue, setInputValue] = useState("");

    const suggestions = [
        {
            icon: <Code2 className="h-4 w-4 text-blue-500" />,
            text: "Jelaskan konsep React Hooks",
            category: "Konsep",
        },
        {
            icon: <Zap className="h-4 w-4 text-yellow-500" />,
            text: "Optimasi performa rendering",
            category: "Tips",
        },
        {
            icon: <Sparkles className="h-4 w-4 text-purple-500" />,
            text: "Buatkan contoh API Route Next.js",
            category: "Contoh Code",
        },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full">
                {/* Hero Section */}
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm mb-8 animate-in fade-in zoom-in duration-500">
                    <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bot className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        Halo, Saya Root AI
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Asisten coding pribadi Anda. Tanyakan apa saja tentang materi, debugging error, atau minta contoh kode.
                    </p>
                </div>

                {/* Suggestions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-10">
                    {suggestions.map((item, i) => (
                        <button
                            key={i}
                            className="group flex flex-col items-start gap-2 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300 text-left"
                            onClick={() => setInputValue(item.text)}
                        >
                            <div className="p-2 rounded-lg bg-background border border-border group-hover:border-primary/20 transition-colors">
                                {item.icon}
                            </div>
                            <div>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {item.category}
                                </span>
                                <p className="text-sm font-medium mt-1 group-hover:text-primary transition-colors">
                                    {item.text}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className="w-full max-w-2xl relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-600/50 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur" />
                    <div className="relative flex items-center gap-2 bg-card p-2 rounded-xl border border-border shadow-sm">
                        <div className="pl-3">
                            <Bot className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ketik pertanyaan coding Anda di sini..."
                            className="flex-1 bg-transparent border-none outline-none text-sm h-10 placeholder:text-muted-foreground/70"
                        />
                        <Button size="sm" className="h-9 px-4 gap-2 transition-all">
                            Kirim <Send className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5 opacity-70">
                        <Sparkles className="h-3 w-3" />
                        Didukung oleh Gemini 2.0 Flash
                    </p>
                </div>
            </div>
        </div>
    );
};
