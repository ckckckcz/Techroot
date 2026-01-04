import { AIModel } from '@/types';

export const AI_MODELS: AIModel[] = [
    { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', description: 'Google (Terbaru)', brand: 'google', color: '#4285F4' },
    { id: 'xiaomi/mimo-v2-flash:free', name: 'Mimo V2 Flash', description: 'Xiaomi (Free)', brand: 'xiaomi', color: '#10a37f' },
    { id: 'nvidia/nemotron-3-nano-30b-a3b:free', name: 'Nemotron 3 Nano', description: 'Nvidia (Free)', brand: 'nvidia', color: '#ff6a00' },
    { id: 'deepseek/deepseek-r1-0528:free', name: 'Deepseek R1', description: 'Deepseek (Free)', brand: 'deepseek', color: '#005696' }
];

export const AVAILABLE_MODEL_IMAGES = ['google', 'nvidia', 'deepseek', 'xiaomi'];
