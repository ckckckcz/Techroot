"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
}

const sidebarItems = [
  { icon: BookOpen, label: "Materi", hash: "" },
  { icon: Bot, label: "Tanya Root", hash: "#ask-root" },
];

export function LearningSidebar({
  pathTitle,
  pathId,
}: LearningSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-14 bg-card border-r border-border flex flex-col items-center py-4 gap-6">
      <div className="w-8 h-10 bg-white" />
      {/* Navigation */}
      <TooltipProvider>
        <nav className="flex flex-col gap-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.hash === ""
                ? true
                : typeof window !== "undefined" &&
                window.location.hash === item.hash;

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.hash || pathname}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
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
