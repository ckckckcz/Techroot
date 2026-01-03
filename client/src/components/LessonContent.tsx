import React, { useState, useEffect } from 'react';
import { Lesson } from '@/data/learningPaths';
import { CodePlayground } from './CodePlayground';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, BookOpen, Video, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonContentProps {
  lesson: Lesson;
  isCompleted: boolean;
  onComplete: () => void;
}

// Simple markdown renderer for the content
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';
    let listItems: React.ReactNode[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = (index: number) => {
      if (listItems.length > 0) {
        if (listType === 'ol') {
          elements.push(
            <ol key={`list-${index}`} className="list-decimal list-inside space-y-1.5 mb-4 text-slate-600">
              {listItems}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`list-${index}`} className="list-disc list-inside space-y-1.5 mb-4 text-slate-600">
              {listItems}
            </ul>
          );
        }
        listItems = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      // Code block handling
      if (line.startsWith('```')) {
        flushList(index);
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeContent = '';
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={`code-${index}`} className="my-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <div className="px-4 py-2 text-xs font-medium text-slate-500 bg-slate-100 border-b border-slate-200">
                {codeLanguage || 'code'}
              </div>
              <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-800 leading-relaxed">
                <code>{codeContent.trim()}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        flushList(index);
        elements.push(
          <h1 key={index} className="text-2xl font-bold text-slate-900 mb-3 mt-6 first:mt-0">
            {line.slice(2)}
          </h1>
        );
        return;
      }
      if (line.startsWith('## ')) {
        flushList(index);
        elements.push(
          <h2 key={index} className="text-xl font-bold text-slate-900 mb-2 mt-5">
            {line.slice(3)}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        flushList(index);
        elements.push(
          <h3 key={index} className="text-base font-bold text-slate-900 mb-2 mt-4">
            {line.slice(4)}
          </h3>
        );
        return;
      }

      // List items (unordered)
      if (line.startsWith('- ') || line.startsWith('* ')) {
        if (listType !== 'ul') {
          flushList(index);
          listType = 'ul';
        }
        const content = line.slice(2);
        listItems.push(
          <li key={`li-${index}`} className="text-slate-600 leading-relaxed">
            {renderInlineCode(content)}
          </li>
        );
        return;
      }

      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        if (listType !== 'ol') {
          flushList(index);
          listType = 'ol';
        }
        const content = line.replace(/^\d+\.\s/, '');
        listItems.push(
          <li key={`li-${index}`} className="text-slate-600 leading-relaxed">
            {renderInlineCode(content)}
          </li>
        );
        return;
      }

      // Empty line
      if (line.trim() === '') {
        flushList(index);
        elements.push(<div key={index} className="h-2" />);
        return;
      }

      // Table row
      if (line.includes('|') && line.trim().startsWith('|')) {
        flushList(index);
        // Skip table for now
        return;
      }

      // Regular paragraph
      flushList(index);
      elements.push(
        <p key={index} className="mb-3 text-slate-600 leading-relaxed">
          {renderInlineCode(line)}
        </p>
      );
    });

    // Flush any remaining list
    flushList(lines.length);

    return elements;
  };

  const renderInlineCode = (text: string): React.ReactNode => {
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 bg-[#2443B0]/10 text-[#2443B0] rounded text-sm font-mono font-medium">
            {part.slice(1, -1)}
          </code>
        );
      }
      // Handle bold
      if (part.includes('**')) {
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((bp, j) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return <strong key={`${i}-${j}`} className="font-semibold text-slate-900">{bp.slice(2, -2)}</strong>;
          }
          return bp;
        });
      }
      return part;
    });
  };

  return <div className="prose-content">{renderContent(content)}</div>;
};

// Material Content Component
const MaterialContent: React.FC<LessonContentProps> = ({ lesson, isCompleted, onComplete }) => {
  const [hasRead, setHasRead] = useState(isCompleted);

  useEffect(() => {
    // Mark as read after 10 seconds if not already completed
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setHasRead(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  return (
    <div className="max-w-7xl">
      <MarkdownContent content={lesson.content || ''} />

      {!isCompleted && (
        <div className="mt-6 pt-6 border-t border-slate-100">
          <Button
            onClick={onComplete}
            disabled={!hasRead}
            className="gap-2 bg-[#2443B0] hover:bg-[#1e3895] text-white rounded-full px-6"
          >
            <CheckCircle className="h-4 w-4" />
            {hasRead ? 'Tandai Selesai' : 'Membaca...'}
          </Button>
          {!hasRead && (
            <p className="text-xs text-slate-500 mt-2">
              Baca materi ini untuk melanjutkan
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Video Content Component
const VideoContent: React.FC<LessonContentProps> = ({ lesson, isCompleted, onComplete }) => {
  const [hasWatched, setHasWatched] = useState(isCompleted);

  return (
    <div className="w-full">
      {/* Video Player */}
      <div className="aspect-video bg-slate-100 rounded-xl mb-5 overflow-hidden border border-slate-200">
        {lesson.videoUrl ? (
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Video className="h-12 w-12 mx-auto mb-3 text-slate-400" />
              <p className="text-slate-500">Video tidak tersedia</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {lesson.content && (
        <div className="mb-5">
          <MarkdownContent content={lesson.content} />
        </div>
      )}

      {!isCompleted && (
        <div className="mt-6 pt-6 border-t border-slate-100">
          <Button
            onClick={() => {
              setHasWatched(true);
              onComplete();
            }}
            className="gap-2 bg-[#2443B0] hover:bg-[#1e3895] text-white rounded-full px-6"
          >
            <CheckCircle className="h-4 w-4" />
            Selesai Menonton
          </Button>
        </div>
      )}
    </div>
  );
};

// Quiz Content Component
const QuizContent: React.FC<LessonContentProps> = ({ lesson, isCompleted, onComplete }) => {
  return (
    <div className="w-full">
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-[#D7FE44] flex items-center justify-center">
            <FileQuestion className="h-5 w-5 text-slate-900" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Kuis Interaktif</h2>
            <p className="text-sm text-slate-500">
              Selesaikan tantangan coding di bawah ini
            </p>
          </div>
        </div>

        {lesson.content && (
          <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <MarkdownContent content={lesson.content} />
          </div>
        )}
      </div>

      <CodePlayground
        initialCode={lesson.starterCode || '// Tulis kode Anda di sini\n'}
        testCases={lesson.testCases || []}
        onSuccess={onComplete}
        showAIFeedback={true}
      />
    </div>
  );
};

// Main Lesson Content Router
export const LessonContent: React.FC<LessonContentProps> = (props) => {
  const { lesson } = props;

  const TypeBadge = () => {
    const config = {
      material: {
        icon: BookOpen,
        label: 'Materi',
        iconBg: 'bg-[#2443B0]',
        iconColor: 'text-white',
        labelColor: 'text-slate-700'
      },
      video: {
        icon: Video,
        label: 'Video',
        iconBg: 'bg-purple-500',
        iconColor: 'text-white',
        labelColor: 'text-slate-700'
      },
      quiz: {
        icon: FileQuestion,
        label: 'Kuis',
        iconBg: 'bg-amber-500',
        iconColor: 'text-white',
        labelColor: 'text-slate-700'
      }
    };

    const { icon: Icon, label, iconBg, iconColor, labelColor } = config[lesson.type];

    return (
      <div className="inline-flex items-center gap-2.5 mb-4">
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shadow-sm", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-semibold", labelColor)}>{label}</span>
          {lesson.isFree && (
            <span className="px-2 py-0.5 bg-[#D7FE44] text-slate-900 text-xs rounded-full font-semibold">
              Gratis
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <TypeBadge />

      {lesson.type === 'material' && <MaterialContent {...props} />}
      {lesson.type === 'video' && <VideoContent {...props} />}
      {lesson.type === 'quiz' && <QuizContent {...props} />}
    </div>
  );
};
