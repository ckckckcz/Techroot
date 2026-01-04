"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Badge, Progress } from '@/types';
import { api, storage } from '@/lib/api';
import { calculateLevel, toDateString } from '@/lib/helpers';

interface UserContextType {
  user: User | null;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  progress: Progress;
  badges: Badge[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, institution?: string) => Promise<boolean>;
  logout: () => void;
  addXP: (amount: number) => void;
  completeLesson: (moduleId: string, lessonId: string, xpReward: number) => Promise<void>;
  completeModule: (pathId: string, moduleId: string, xpReward?: number) => Promise<void>;
  setCurrentPosition: (pathId: string, moduleId: string, lessonId?: string) => void;
  syncProgress: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const INITIAL_PROGRESS: Progress = { completedLessons: [], completedModules: [], currentPath: null, currentModule: null, currentLesson: null };

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS);

  const fetchProgress = useCallback(async () => {
    try {
      const data = await api<{ success: boolean; data: any }>('/api/progress');
      if (data.success && data.data) {
        const d = data.data;
        setProgress({ completedLessons: d.completed_lessons || [], completedModules: d.completed_modules || [], currentPath: d.current_path, currentModule: d.current_module, currentLesson: d.current_lesson });
        if (d.xp !== undefined) setXP(d.xp);
        if (d.streak !== undefined) setStreak(d.streak);
        if (d.last_active_date) setLastActiveDate(d.last_active_date);
        if (d.badges) setBadges(d.badges);
      }
    } catch {
      const saved = storage.get<Progress>('progress');
      if (saved) setProgress(saved);
      const savedXP = storage.get<number>('xp');
      const savedStreak = storage.get<number>('streak');
      if (savedXP) setXP(savedXP);
      if (savedStreak) setStreak(savedStreak);
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = storage.get<User>('user');
      const token = storage.get<string>('token');
      if (savedUser && token) {
        setUser(savedUser);
        await fetchProgress();
      }
      setIsLoading(false);
    };
    loadUser();
  }, [fetchProgress]);

  useEffect(() => {
    if (user) {
      storage.set('user', user);
      storage.set('progress', progress);
      storage.set('xp', xp);
      storage.set('streak', streak);
    }
  }, [user, progress, xp, streak]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await api<{ success: boolean; data: { user: User; token: string } }>('/api/auth/login', { method: 'POST', body: { email, password } });
      if (data.success && data.data) {
        const { user: u, token } = data.data;
        setUser(u);
        storage.set('token', token);
        storage.set('user', u);
        await fetchProgress();
        return true;
      }
      return false;
    } catch { return false; }
    finally { setIsLoading(false); }
  };

  const register = async (name: string, email: string, password: string, institution?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await api<{ success: boolean; data: { user: User; token: string } }>('/api/auth/register', { method: 'POST', body: { name, email, password, institution } });
      if (data.success && data.data) {
        const { user: u, token } = data.data;
        setUser(u);
        setXP(0);
        setStreak(1);
        setLastActiveDate(toDateString());
        setProgress(INITIAL_PROGRESS);
        setBadges([]);
        storage.set('token', token);
        storage.set('user', u);
        return true;
      }
      return false;
    } catch { return false; }
    finally { setIsLoading(false); }
  };

  const logout = () => {
    setUser(null);
    setXP(0);
    setStreak(0);
    setLastActiveDate(null);
    setProgress(INITIAL_PROGRESS);
    setBadges([]);
    storage.clearAll();
  };

  const addXP = useCallback((amount: number) => setXP(prev => prev + amount), []);

  const completeLesson = useCallback(async (moduleId: string, lessonId: string, xpReward: number) => {
    const key = `${moduleId}:${lessonId}`;
    setProgress(p => p.completedLessons.includes(key) ? p : { ...p, completedLessons: [...p.completedLessons, key] });
    setXP(p => p + xpReward);
    try { await api('/api/progress/lesson', { method: 'POST', body: { lesson_key: key, xp_reward: xpReward } }); } catch { }
  }, []);

  const completeModule = useCallback(async (pathId: string, moduleId: string, xpReward?: number) => {
    const key = `${pathId}:${moduleId}`;
    setProgress(p => p.completedModules.includes(key) ? p : { ...p, completedModules: [...p.completedModules, key] });
    if (xpReward) setXP(p => p + xpReward);
    try { await api('/api/progress/module', { method: 'POST', body: { module_key: key, xp_reward: xpReward || 0 } }); } catch { }
  }, []);

  const setCurrentPosition = useCallback((pathId: string, moduleId: string, lessonId?: string) => {
    setProgress(p => ({ ...p, currentPath: pathId, currentModule: moduleId, currentLesson: lessonId || null }));
    api('/api/progress/current', { method: 'PUT', body: { current_path: pathId, current_module: moduleId, current_lesson: lessonId } }).catch(() => { });
  }, []);

  const syncProgress = useCallback(async () => {
    if (!user) return;
    try {
      await api('/api/progress/sync', { method: 'POST', body: { completed_lessons: progress.completedLessons, completed_modules: progress.completedModules, current_path: progress.currentPath, current_module: progress.currentModule, current_lesson: progress.currentLesson, xp, streak } });
    } catch { }
  }, [user, progress, xp, streak]);

  useEffect(() => {
    const handleUnload = () => {
      if (user && storage.get('token')) {
        navigator.sendBeacon('/api/progress/sync', new Blob([JSON.stringify({ completed_lessons: progress.completedLessons, completed_modules: progress.completedModules, current_path: progress.currentPath, current_module: progress.currentModule, current_lesson: progress.currentLesson, xp, streak })], { type: 'application/json' }));
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [user, progress, xp, streak]);

  return (
    <UserContext.Provider value={{ user, xp, level: calculateLevel(xp), streak, lastActiveDate, progress, badges, isAuthenticated: !!user, isLoading, login, register, logout, addXP, completeLesson, completeModule, setCurrentPosition, syncProgress }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
