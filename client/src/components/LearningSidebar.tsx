"use client";

import Link from "next/link";
import { BookOpen, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LearningSidebarProps {
  pathTitle: string;
  pathId: string;
  activeTab: 'materi' | 'tanya-root';
  onTabChange: (tab: 'materi' | 'tanya-root') => void;
}

const sidebarItems = [
  { id: 'materi' as const, icon: BookOpen, label: "Materi" },
  { id: 'tanya-root' as const, icon: Bot, label: "Tanya Root" },
];

export function LearningSidebar({
  pathTitle,
  pathId,
  activeTab,
  onTabChange,
}: LearningSidebarProps) {
  return (
    <div className="w-14 bg-white border-r border-slate-100 flex flex-col items-center py-4 gap-6">
      <div className="w-8 h-10 bg-white" />
      {/* Navigation */}
      <TooltipProvider>
        <nav className="flex flex-col gap-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-lg transition-colors",
                      isActive
                        ? "bg-[#2443B0]/10 text-[#2443B0]"
                        : "hover:bg-slate-100 text-slate-400"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    </div>
  );
}
