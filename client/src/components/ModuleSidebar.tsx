import React, { useState } from 'react';
import Link from "next/link";
import { ChevronDown, ChevronRight, BookOpen, Play, FileQuestion, Check, Circle, Lock } from 'lucide-react';
import { Module, Section, Lesson } from '@/data/learningPaths';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ModuleSidebarProps {
  module: Module;
  pathId: string;
  currentLessonId?: string;
  completedLessons: string[];
  progress: number;
}

const LessonIcon: React.FC<{ type: Lesson['type']; className?: string }> = ({ type, className }) => {
  switch (type) {
    case 'material':
      return <BookOpen className={cn("h-4 w-4", className)} />;
    case 'video':
      return <Play className={cn("h-4 w-4", className)} />;
    case 'quiz':
      return <FileQuestion className={cn("h-4 w-4", className)} />;
    default:
      return <Circle className={cn("h-4 w-4", className)} />;
  }
};

const SectionItem: React.FC<{
  section: Section;
  pathId: string;
  moduleId: string;
  currentLessonId?: string;
  completedLessons: string[];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ section, pathId, moduleId, currentLessonId, completedLessons, isExpanded, onToggle }) => {
  const completedCount = section.lessons.filter(l =>
    completedLessons.includes(`${moduleId}:${l.id}`)
  ).length;
  const isComplete = completedCount === section.lessons.length;

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">{section.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {isComplete && <Check className="h-4 w-4 text-success" />}
          <span className="text-xs text-muted-foreground">
            {completedCount}/{section.lessons.length}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="pb-2">
          {section.lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(`${moduleId}:${lesson.id}`);
            const isCurrent = lesson.id === currentLessonId;

            return (
              <Link
                key={lesson.id}
                href={`/learn/${pathId}/${moduleId}/${lesson.id}`}
                className={cn(
                  "flex items-start gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted/50",
                  isCurrent && "bg-primary/10 border-l-2 border-primary",
                  !isCurrent && "border-l-2 border-transparent"
                )}
              >
                <div className={cn(
                  "mt-0.5 flex-shrink-0",
                  isCompleted ? "text-success" : isCurrent ? "text-primary" : "text-muted-foreground"
                )}>
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <LessonIcon type={lesson.type} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn(
                    "block truncate",
                    isCurrent && "font-medium text-foreground",
                    !isCurrent && "text-muted-foreground"
                  )}>
                    {lesson.title}
                  </span>
                  {lesson.isFree && (
                    <span className="text-xs text-muted-foreground">(Gratis)</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ModuleSidebar: React.FC<ModuleSidebarProps> = ({
  module,
  pathId,
  currentLessonId,
  completedLessons,
  progress
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    // Auto-expand section containing current lesson
    if (currentLessonId) {
      for (const section of module.sections) {
        if (section.lessons.some(l => l.id === currentLessonId)) {
          return [section.id];
        }
      }
    }
    return [module.sections[0]?.id || ''];
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col">
      {/* Tabs */}
      <Tabs defaultValue="modules" className="flex-1 flex flex-col">
        <div className="border-b border-border p-2">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="modules" className="text-xs">Daftar Modul</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Catatan Belajar</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="modules" className="flex-1 flex flex-col m-0 overflow-hidden">
          {/* Progress */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <Progress value={progress} className="flex-1 h-2" />
            </div>
            <p className="text-sm text-muted-foreground">{progress}% Selesai</p>
          </div>

          {/* Sections List */}
          <div className="flex-1 overflow-y-auto">
            {module.sections.map((section) => (
              <SectionItem
                key={section.id}
                section={section}
                pathId={pathId}
                moduleId={module.id}
                currentLessonId={currentLessonId}
                completedLessons={completedLessons}
                isExpanded={expandedSections.includes(section.id)}
                onToggle={() => toggleSection(section.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="flex-1 m-0 p-4">
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Belum ada catatan</p>
            <p className="text-xs mt-1">Catatan belajar Anda akan muncul di sini</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
