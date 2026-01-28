/**
 * Global Type Definitions
 * Stub implementations for planned features
 */

export type RegularMeetingType = 'in_person' | 'online' | 'hybrid';

export interface DailyReading {
  id: string;
  date: string;
  title: string;
  content: string;
  source: string;
  reflection_prompt: string;
}

export interface DailyReadingReflection {
  id: string;
  reading_id: string;
  readingDate: string; // Format: 'MM-DD'
  user_id: string;
  encrypted_reflection: string;
  reflection: string;
  created_at: string;
}

export interface RegularMeeting {
  id: string;
  user_id: string;
  meeting_id: string;
  name: string;
  location: string;
  day_of_week: number;
  dayOfWeek: number; // Alias for backwards compatibility
  time: string;
  type: RegularMeetingType;
  is_active: boolean;
  isHomeGroup?: boolean;
  reminderEnabled?: boolean;
  reminderMinutesBefore?: number;
  encrypted_notes?: string;
  notes?: string;
  created_at: string;
}

export interface SobrietyMilestone {
  id: string;
  user_id: string;
  days: number;
  achieved_at: string;
  celebrated: boolean;
}
