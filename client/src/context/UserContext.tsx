"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Progress {
  completedModules: string[];
  currentPath: string | null;
  currentModule: string | null;
}

interface UserContextType {
  user: User | null;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  progress: Progress;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addXP: (amount: number) => void;
  completeModule: (pathId: string, moduleId: string) => void;
  setCurrentModule: (pathId: string, moduleId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const XP_PER_LEVEL = 200;

const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>({
    completedModules: [],
    currentPath: null,
    currentModule: null,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('codelearn_user');
    const savedXP = localStorage.getItem('codelearn_xp');
    const savedStreak = localStorage.getItem('codelearn_streak');
    const savedLastActive = localStorage.getItem('codelearn_lastActive');
    const savedProgress = localStorage.getItem('codelearn_progress');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedXP) setXP(parseInt(savedXP));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedLastActive) setLastActiveDate(savedLastActive);
    if (savedProgress) setProgress(JSON.parse(savedProgress));
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('codelearn_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('codelearn_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('codelearn_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('codelearn_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    if (lastActiveDate) {
      localStorage.setItem('codelearn_lastActive', lastActiveDate);
    }
  }, [lastActiveDate]);

  useEffect(() => {
    localStorage.setItem('codelearn_progress', JSON.stringify(progress));
  }, [progress]);

  // Check and update streak
  useEffect(() => {
    if (!user) return;

    const today = new Date().toDateString();
    if (lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActiveDate === yesterday.toDateString()) {
        setStreak(prev => prev + 1);
      } else if (lastActiveDate !== null) {
        setStreak(1);
      } else {
        setStreak(1);
      }
      setLastActiveDate(today);
    }
  }, [user, lastActiveDate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo, any valid email/password combo works
    if (email && password.length >= 4) {
      const savedUsers = JSON.parse(localStorage.getItem('codelearn_users') || '[]');
      const existingUser = savedUsers.find((u: any) => u.email === email);

      if (existingUser) {
        setUser(existingUser);
        return true;
      }
      return false;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (name && email && password.length >= 4) {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
      };

      const savedUsers = JSON.parse(localStorage.getItem('codelearn_users') || '[]');
      savedUsers.push(newUser);
      localStorage.setItem('codelearn_users', JSON.stringify(savedUsers));

      setUser(newUser);
      setXP(0);
      setStreak(1);
      setLastActiveDate(new Date().toDateString());
      setProgress({
        completedModules: [],
        currentPath: null,
        currentModule: null,
      });

      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setXP(0);
    setStreak(0);
    setLastActiveDate(null);
    setProgress({
      completedModules: [],
      currentPath: null,
      currentModule: null,
    });
  };

  const addXP = (amount: number) => {
    setXP(prev => prev + amount);
  };

  const completeModule = (pathId: string, moduleId: string) => {
    const key = `${pathId}:${moduleId}`;
    if (!progress.completedModules.includes(key)) {
      setProgress(prev => ({
        ...prev,
        completedModules: [...prev.completedModules, key],
      }));
    }
  };

  const setCurrentModule = (pathId: string, moduleId: string) => {
    setProgress(prev => ({
      ...prev,
      currentPath: pathId,
      currentModule: moduleId,
    }));
  };

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
        isAuthenticated: !!user,
        login,
        register,
        logout,
        addXP,
        completeModule,
        setCurrentModule,
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
