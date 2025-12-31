"use client";

import Link from "next/link";
import { Lock, CheckCircle, Play, Zap } from "lucide-react";

import { Module } from "@/data/learningPaths";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  module: Module;
  pathId: string;
  status: "locked" | "active" | "completed";
  index: number;
}

const levelColors = {
  beginner: "bg-secondary",
  intermediate: "bg-secondary",
  advanced: "bg-secondary",
};

export function ModuleCard({
  module,
  pathId,
  status,
  index,
}: ModuleCardProps) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";

  const content = (
    <div
      className={cn(
        "group relative border border-border rounded-lg p-5 transition-all duration-200",
        isLocked
          ? "opacity-60 cursor-not-allowed"
          : "card-hover cursor-pointer",
        isCompleted && "border-success/30 bg-success/5"
      )}
    >
      <div className="absolute -top-3 left-4 px-2 bg-background text-xs font-mono text-muted-foreground">
        Module {index + 1}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold truncate">{module.title}</h3>
            {isCompleted && <CheckCircle className="h-4 w-4 text-success" />}
            {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {module.description}
          </p>

          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-md font-medium capitalize",
                levelColors[module.level]
              )}
            >
              {module.level}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              <span>+{module.xpReward} XP</span>
            </div>
          </div>
        </div>

        {!isLocked && (
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              isCompleted
                ? "bg-success/10 text-success"
                : "bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
            )}
          >
            {isCompleted ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (isLocked) return content;

  return (
    <Link href={`/learn/${pathId}/${module.id}`}>
      {content}
    </Link>
  );
}
