"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Lesson } from "@/data/learningPaths";
import { cn } from "@/lib/utils";

interface LessonNavigationProps {
  pathId: string;
  moduleId: string;
  prevLesson: { lesson: Lesson; sectionId: string } | null;
  nextLesson: { lesson: Lesson; sectionId: string } | null;
  currentLessonTitle: string;
}

export function LessonNavigation({
  pathId,
  moduleId,
  prevLesson,
  nextLesson,
  currentLessonTitle,
}: LessonNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Previous */}
        {prevLesson ? (
          <Link
            href={`/learn/${pathId}/${moduleId}/${prevLesson.lesson.id}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm hidden sm:block max-w-[200px] truncate">
              {prevLesson.lesson.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {/* Current */}
        <div className="text-center">
          <span className="text-sm font-medium truncate max-w-[300px] block">
            {currentLessonTitle}
          </span>
        </div>

        {/* Next / Finish */}
        {nextLesson ? (
          <Link
            href={`/learn/${pathId}/${moduleId}/${nextLesson.lesson.id}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span className="text-sm hidden sm:block max-w-[200px] truncate">
              {nextLesson.lesson.title}
            </span>
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <Link
            href={`/paths/${pathId}`}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
          >
            <span className="text-sm">Selesai</span>
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
