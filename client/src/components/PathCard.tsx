"use client";

import Link from "next/link";
import { Code2, Lightbulb, Layout, ArrowRight } from "lucide-react";

import { LearningPath } from "@/data/learningPaths";
import { useUser } from "@/context/UserContext";

const iconMap = {
  Code2: <Code2 className="h-6 w-6" />,
  Lightbulb: <Lightbulb className="h-6 w-6" />,
  Layout: <Layout className="h-6 w-6" />,
};

export function PathCard({ path }: { path: LearningPath }) {
  const { progress } = useUser();

  const completed = path.modules.filter((m) =>
    progress.completedModules.includes(`${path.id}:${m.id}`)
  ).length;

  const total = path.modules.length;
  const percent = total ? (completed / total) * 100 : 0;

  return (
    <Link href={`/paths/${path.id}`}>
      <div className="group border border-border rounded-lg p-6 card-hover h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
            {iconMap[path.icon as keyof typeof iconMap] ?? <Code2 className="h-6 w-6" />}
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-all" />
        </div>

        <h3 className="font-semibold text-lg mb-2">{path.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">
          {path.description}
        </p>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{total} modules</span>
            <span>{completed}/{total}</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
