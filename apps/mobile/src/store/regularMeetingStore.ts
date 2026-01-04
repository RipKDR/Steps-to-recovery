/**
 * Regular Meeting Store
 * Stub implementation for regular meeting tracking (planned for future phase)
 */

import { create } from 'zustand';
import type { RegularMeeting } from '../types';

interface RegularMeetingStore {
  meetings: RegularMeeting[];
  upcomingMeeting: RegularMeeting | null;
  isLoading: boolean;
  loadMeetings: () => Promise<void>;
  addMeeting: (meetingId: string, dayOfWeek: number, time: string) => Promise<void>;
  removeMeeting: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
}

export const useRegularMeetingStore = create<RegularMeetingStore>((set) => ({
  meetings: [],
  upcomingMeeting: null,
  isLoading: false,
  loadMeetings: async (): Promise<void> => {
    // TODO: Implement in future phase
    set({ isLoading: false });
  },
  addMeeting: async (_meetingId: string, _dayOfWeek: number, _time: string): Promise<void> => {
    // TODO: Implement in future phase
  },
  removeMeeting: async (_id: string): Promise<void> => {
    // TODO: Implement in future phase
  },
  toggleActive: async (_id: string): Promise<void> => {
    // TODO: Implement in future phase
  },
}));
