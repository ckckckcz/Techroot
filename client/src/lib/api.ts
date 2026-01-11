export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://backend-techroot.vercel.app').replace(/\/+$/, '');

// Auth helpers
export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('Techroot_token') : null;

export const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

// Storage helpers
const STORAGE_KEYS = {
    token: 'Techroot_token',
    user: 'Techroot_user',
    progress: 'Techroot_progress',
    xp: 'Techroot_xp',
    streak: 'Techroot_streak',
    completedLessons: 'completedLessons'
} as const;

export const storage = {
    get: <T>(key: keyof typeof STORAGE_KEYS): T | null => {
        if (typeof window === 'undefined') return null;
        const value = localStorage.getItem(STORAGE_KEYS[key]);
        if (!value) return null;
        try { return JSON.parse(value); } catch { return value as T; }
    },
    set: (key: keyof typeof STORAGE_KEYS, value: unknown) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS[key], typeof value === 'string' ? value : JSON.stringify(value));
    },
    remove: (key: keyof typeof STORAGE_KEYS) => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS[key]);
    },
    clearAll: () => Object.keys(STORAGE_KEYS).forEach(key => storage.remove(key as keyof typeof STORAGE_KEYS))
};

// API request helper
type RequestOptions = { method?: string; body?: unknown; headers?: Record<string, string> };

export const api = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    const { method = 'GET', body, headers = {} } = options;
    const fetchOptions: RequestInit = {
        method,
        headers: { ...getAuthHeaders(), ...headers }
    };
    if (body) fetchOptions.body = JSON.stringify(body);
    const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
    return response.json();
};
