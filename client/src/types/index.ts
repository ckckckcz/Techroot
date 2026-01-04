// ==================== USER TYPES ====================
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

export interface Badge {
    badge_id: string;
    badge_name: string;
    earned_at: string;
}

export interface Progress {
    completedLessons: string[];
    completedModules: string[];
    currentPath: string | null;
    currentModule: string | null;
    currentLesson: string | null;
}

// ==================== LEARNING TYPES ====================
export interface TestCase {
    input: string;
    expected: string;
    description: string;
}

export type ContentType = 'material' | 'video' | 'quiz';
export type LevelType = 'beginner' | 'intermediate' | 'advanced';

export interface Lesson {
    id: string;
    title: string;
    type: ContentType;
    isFree?: boolean;
    content?: string;
    videoUrl?: string;
    starterCode?: string;
    testCases?: TestCase[];
    xpReward: number;
}

export interface Section {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Module {
    id: string;
    title: string;
    description: string;
    level: LevelType;
    xpReward: number;
    sections: Section[];
}

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    icon: string;
    modules: Module[];
}

// ==================== AI CHAT TYPES ====================
export interface AIModel {
    id: string;
    name: string;
    description: string;
    brand: string;
    color: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

// ==================== LANDING PAGE TYPES ====================
export interface Category {
    id: string;
    title: string;
    count: string;
    images: string[];
}

export interface Testimonial {
    name: string;
    role: string;
    avatar: string;
    quote: string;
    highlight: string;
    highlightColor: string;
}

export interface Feature {
    title: string;
    description: string;
    icon: string;
}
