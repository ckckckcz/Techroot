import { AIModel } from '@/types';

export const AI_MODELS: AIModel[] = [
    { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', description: 'Google (Terbaru)', brand: 'google', color: '#4285F4' },
    { id: 'xiaomi/mimo-v2-flash:free', name: 'Mimo V2 Flash', description: 'Xiaomi (Free)', brand: 'xiaomi', color: '#10a37f' },
    { id: 'nvidia/nemotron-3-nano-30b-a3b:free', name: 'Nemotron 3 Nano', description: 'Nvidia (Free)', brand: 'nvidia', color: '#ff6a00' },
    { id: 'deepseek/deepseek-r1-0528:free', name: 'Deepseek R1', description: 'Deepseek (Free)', brand: 'deepseek', color: '#005696' }
];

export const AVAILABLE_MODEL_IMAGES = ['google', 'nvidia', 'deepseek', 'xiaomi'];

// System prompt untuk AI agar tetap dalam context pembelajaran coding
export const getSystemPrompt = (moduleTitle?: string, lessonTitle?: string) => {
    const basePrompt = `Kamu adalah Root, asisten AI untuk pembelajaran coding di platform Techroot. 

ATURAN PENTING:
1. Kamu HANYA boleh menjawab pertanyaan tentang pemrograman, coding, dan teknologi
2. Jika user bertanya di luar topik coding (misal: resep masakan, olahraga, dll), TOLAK dengan sopan dan arahkan kembali ke topik coding
3. Jawab dengan bahasa Indonesia yang santai tapi profesional
4. Berikan contoh kode jika diperlukan
5. Jelaskan dengan detail tapi mudah dipahami`;

    const contextPrompt = moduleTitle && lessonTitle
        ? `\n6. Saat ini user sedang mempelajari: "${moduleTitle}" - "${lessonTitle}". Prioritaskan menjawab pertanyaan terkait materi ini, tapi tetap boleh jawab pertanyaan coding lainnya.`
        : '';

    return basePrompt + contextPrompt;
};

