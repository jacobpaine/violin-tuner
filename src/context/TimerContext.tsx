import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Mode } from "../types/timerTypes";

export interface TimerData {
  mode: Mode;
  isRunning: boolean;
  durations: { focus: number; shortBreak: number };
  secondsLeft: number;
  startedAt: number | null;
  elapsed: { focus: number; shortBreak: number };
  total: { focus: number; shortBreak: number };
  completedCounts: { focus: number; shortBreak: number };
}

interface TimerContextType {
  timers: Record<string, TimerData>;
  setTimers: React.Dispatch<React.SetStateAction<Record<string, TimerData>>>;
  updateTimer: (key: string, updates: Partial<TimerData>) => void;
  removeTimer: (key: string) => void;
  addTimer: (key: string, initial?: Partial<TimerData>) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [timers, setTimers] = useState<Record<string, TimerData>>({});

  useEffect(() => {
    const restored: Record<string, TimerData> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      try {
        const value = localStorage.getItem(key);
        if (!value) continue;
        const parsed = JSON.parse(value);
        if (
          parsed &&
          typeof parsed.mode === "string" &&
          typeof parsed.isRunning === "boolean" &&
          parsed.durations &&
          parsed.secondsLeft != null
        ) {
          restored[key] = parsed;
        }
      } catch {
        continue;
      }
    }
    setTimers(restored);
  }, []);

  useEffect(() => {
    Object.entries(timers).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }, [timers]);

  const updateTimer = (key: string, updates: Partial<TimerData>) => {
    setTimers((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...updates },
    }));
  };

  const removeTimer = (key: string) => {
    setTimers((prev) => {
      const newTimers = { ...prev };
      delete newTimers[key];
      localStorage.removeItem(key);
      return newTimers;
    });
  };

  const addTimer = (key: string, initial: Partial<TimerData> = {}) => {
    setTimers((prev) => ({
      ...prev,
      [key]: {
        mode: "focus",
        isRunning: false,
        durations: { focus: 1800, shortBreak: 300 },
        secondsLeft: 1800,
        startedAt: null,
        total: { focus: 0, shortBreak: 0 },
        elapsed: { focus: 0, shortBreak: 0 },
        completedCounts: { focus: 0, shortBreak: 0 },
        ...initial,
      },
    }));
  };

  return (
    <TimerContext.Provider
      value={{ timers, setTimers, updateTimer, removeTimer, addTimer }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
};
