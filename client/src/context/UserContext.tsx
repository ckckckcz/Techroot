"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface Progress {
  completedLessons: string[];
  completedModules: string[];
  currentPath: string | null;
  currentModule: string | null;
  currentLesson: string | null;
}

interface Badge {
  badge_id: string;
  badge_name: string;
  earned_at: string;
}

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

const XP_PER_LEVEL = 200;

const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('Techroot_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<Progress>({
    completedLessons: [],
    completedModules: [],
    currentPath: null,
    currentModule: null,
    currentLesson: null,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUser = localStorage.getItem('Techroot_user');
        const token = localStorage.getItem('Techroot_token');

        if (savedUser && token) {
          const userData = JSON.parse(savedUser);
          setUser(userData);

          // Fetch progress from backend
          await fetchProgressFromServer(token);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Fetch progress from server
  const fetchProgressFromServer = async (token?: string) => {
    try {
      const authToken = token || localStorage.getItem('Techroot_token');
      if (!authToken) return;

      const response = await fetch(`${API_URL}/api/progress`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        const progressData = data.data;

        setProgress({
          completedLessons: progressData.completed_lessons || [],
          completedModules: progressData.completed_modules || [],
          currentPath: progressData.current_path,
          currentModule: progressData.current_module,
          currentLesson: progressData.current_lesson,
        });

        if (progressData.xp !== undefined) setXP(progressData.xp);
        if (progressData.streak !== undefined) setStreak(progressData.streak);
        if (progressData.last_active_date) setLastActiveDate(progressData.last_active_date);
        if (progressData.badges) setBadges(progressData.badges);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      // Fallback to localStorage
      const savedProgress = localStorage.getItem('Techroot_progress');
      const savedXP = localStorage.getItem('Techroot_xp');
      const savedStreak = localStorage.getItem('Techroot_streak');

      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        setProgress({
          completedLessons: parsed.completedLessons || [],
          completedModules: parsed.completedModules || [],
          currentPath: parsed.currentPath,
          currentModule: parsed.currentModule,
          currentLesson: parsed.currentLesson,
        });
      }
      if (savedXP) setXP(parseInt(savedXP));
      if (savedStreak) setStreak(parseInt(savedStreak));
    }
  };

  // Save progress to localStorage as backup
  useEffect(() => {
    if (user) {
      localStorage.setItem('Techroot_user', JSON.stringify(user));
      localStorage.setItem('Techroot_progress', JSON.stringify(progress));
      localStorage.setItem('Techroot_xp', xp.toString());
      localStorage.setItem('Techroot_streak', streak.toString());
    }
  }, [user, progress, xp, streak]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { user, token } = data.data;
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        });

        localStorage.setItem('Techroot_token', token);
        localStorage.setItem('Techroot_user', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        }));

        // Fetch progress after login
        await fetchProgressFromServer(token);

        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, institution?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, institution }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { user, token } = data.data;
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        };

        setUser(userData);
        setXP(0);
        setStreak(1);
        setLastActiveDate(new Date().toDateString());
        setProgress({
          completedLessons: [],
          completedModules: [],
          currentPath: null,
          currentModule: null,
          currentLesson: null,
        });
        setBadges([]);

        localStorage.setItem('Techroot_token', token);
        localStorage.setItem('Techroot_user', JSON.stringify(userData));

        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setXP(0);
    setStreak(0);
    setLastActiveDate(null);
    setProgress({
      completedLessons: [],
      completedModules: [],
      currentPath: null,
      currentModule: null,
      currentLesson: null,
    });
    setBadges([]);

    localStorage.removeItem('Techroot_token');
    localStorage.removeItem('Techroot_user');
    localStorage.removeItem('Techroot_progress');
    localStorage.removeItem('Techroot_xp');
    localStorage.removeItem('Techroot_streak');
    localStorage.removeItem('completedLessons');
  };

  const addXP = useCallback((amount: number) => {
    setXP(prev => prev + amount);
  }, []);

  const completeLesson = useCallback(async (moduleId: string, lessonId: string, xpReward: number) => {
    const lessonKey = `${moduleId}:${lessonId}`;

    // Optimistic update
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonKey)) {
        return prev;
      }
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonKey],
      };
    });
    setXP(prev => prev + xpReward);

    // Sync with backend
    try {
      await fetch(`${API_URL}/api/progress/lesson`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ lesson_key: lessonKey, xp_reward: xpReward }),
      });
    } catch (error) {
      console.error('Error syncing lesson completion:', error);
    }
  }, []);

  const completeModule = useCallback(async (pathId: string, moduleId: string, xpReward?: number) => {
    const moduleKey = `${pathId}:${moduleId}`;

    // Optimistic update
    setProgress(prev => {
      if (prev.completedModules.includes(moduleKey)) {
        return prev;
      }
      return {
        ...prev,
        completedModules: [...prev.completedModules, moduleKey],
      };
    });

    if (xpReward) {
      setXP(prev => prev + xpReward);
    }

    // Sync with backend
    try {
      await fetch(`${API_URL}/api/progress/module`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ module_key: moduleKey, xp_reward: xpReward || 0 }),
      });
    } catch (error) {
      console.error('Error syncing module completion:', error);
    }
  }, []);

  const setCurrentPosition = useCallback((pathId: string, moduleId: string, lessonId?: string) => {
    setProgress(prev => ({
      ...prev,
      currentPath: pathId,
      currentModule: moduleId,
      currentLesson: lessonId || null,
    }));

    // Sync with backend (fire and forget)
    fetch(`${API_URL}/api/progress/current`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        current_path: pathId,
        current_module: moduleId,
        current_lesson: lessonId
      }),
    }).catch(error => console.error('Error syncing current position:', error));
  }, []);

  const syncProgress = useCallback(async () => {
    if (!user) return;

    try {
      await fetch(`${API_URL}/api/progress/sync`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          completed_lessons: progress.completedLessons,
          completed_modules: progress.completedModules,
          current_path: progress.currentPath,
          current_module: progress.currentModule,
          current_lesson: progress.currentLesson,
          xp,
          streak,
        }),
      });
    } catch (error) {
      console.error('Error syncing progress:', error);
    }
  }, [user, progress, xp, streak]);

  // Sync progress before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user) {
        // Use sendBeacon for reliable sync on page unload
        const data = JSON.stringify({
          completed_lessons: progress.completedLessons,
          completed_modules: progress.completedModules,
          current_path: progress.currentPath,
          current_module: progress.currentModule,
          current_lesson: progress.currentLesson,
          xp,
          streak,
        });

        const token = localStorage.getItem('Techroot_token');
        if (token) {
          navigator.sendBeacon(
            `${API_URL}/api/progress/sync`,
            new Blob([data], { type: 'application/json' })
          );
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user, progress, xp, streak]);

  const level = calculateLevel(xp);

  return (
    <UserContext.Provider
      value={{
        user,
        xp,
        level,
        streak,
        lastActiveDate,
        progress,
        badges,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        addXP,
        completeLesson,
        completeModule,
        setCurrentPosition,
        syncProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
