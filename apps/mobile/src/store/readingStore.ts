/**
 * Reading Store
 * Stub implementation for daily reading feature (planned for future phase)
 */

import { create } from 'zustand';
import type { DailyReading, DailyReadingReflection } from '../types';

interface ReadingStore {
  todayReading: DailyReading | null;
  todayReflection: DailyReadingReflection | null;
  reflections: DailyReadingReflection[];
  readingStreak: number;
  isLoading: boolean;
  loadTodayReading: () => Promise<void>;
  saveReflection: (reflection: string) => Promise<void>;
  markAsRead: (readingId: string) => Promise<void>;
}

export const useReadingStore = create<ReadingStore>((set) => ({
  todayReading: null,
  todayReflection: null,
  reflections: [],
  readingStreak: 0,
  isLoading: false,
  loadTodayReading: async (): Promise<void> => {
    // TODO: Implement in future phase
    set({ isLoading: false });
  },
  saveReflection: async (_reflection: string): Promise<void> => {
    // TODO: Implement in future phase
  },
  markAsRead: async (_readingId: string): Promise<void> => {
    // TODO: Implement in future phase
  },
}));
