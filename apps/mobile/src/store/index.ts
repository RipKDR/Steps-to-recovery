/**
 * Store Index
 * Central export for all Zustand stores
 */

export { useReadingStore } from './readingStore';
export { useRegularMeetingStore } from './regularMeetingStore';

// Stub store for sobriety tracking
import { create } from 'zustand';

interface SobrietyStore {
  sobrietyDate: Date | null;
  currentDays: number;
  setSobrietyDate: (date: Date) => void;
  resetSobriety: () => void;
}

export const useSobrietyStore = create<SobrietyStore>((set) => ({
  sobrietyDate: null,
  currentDays: 0,
  setSobrietyDate: (date: Date): void => {
    set({ sobrietyDate: date });
  },
  resetSobriety: (): void => {
    set({ sobrietyDate: null, currentDays: 0 });
  },
}));
