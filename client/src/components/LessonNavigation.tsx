"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";

import { Lesson } from "@/data/learningPaths";
import { cn } from "@/lib/utils";

interface LessonNavigationProps {
  pathId: string;
  moduleId: string;
  prevLesson: { lesson: Lesson; sectionId: string } | null;
  nextLesson: { lesson: Lesson; sectionId: string } | null;
  currentLessonTitle: string;
  currentLessonXP?: number;
  onFinish?: () => void;
}

export function LessonNavigation({
  pathId,
  moduleId,
  prevLesson,
  nextLesson,
  currentLessonTitle,
  currentLessonXP = 0,
  onFinish,
}: LessonNavigationProps) {
  const router = useRouter();

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    }
    // Navigate to result page with params
    router.push(`/result?pathId=${pathId}&moduleId=${moduleId}&xp=${currentLessonXP}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Previous */}
        {prevLesson ? (
          <Link
            href={`/learn/${pathId}/${moduleId}/${prevLesson.lesson.id}`}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
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
          <span className="text-sm font-medium text-slate-900 truncate max-w-[300px] block">
            {currentLessonTitle}
          </span>
        </div>

        {/* Next / Finish */}
        {nextLesson ? (
          <Link
            href={`/learn/${pathId}/${moduleId}/${nextLesson.lesson.id}`}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <span className="text-sm hidden sm:block max-w-[200px] truncate">
              {nextLesson.lesson.title}
            </span>
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 bg-[#D7FE44] hover:bg-[#c5eb3d] text-slate-900 px-4 py-2 rounded-full font-semibold transition-all hover:scale-105"
          >
            <Trophy className="h-4 w-4" />
            <span className="text-sm">Selesai</span>
          </button>
        )}
      </div>
    </div>
  );
}
