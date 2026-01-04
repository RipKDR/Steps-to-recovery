/**
 * Global Type Definitions
 * Stub implementations for planned features
 */

export interface DailyReading {
  id: string;
  date: string;
  title: string;
  content: string;
  reflection_prompt: string;
}

export interface DailyReadingReflection {
  id: string;
  reading_id: string;
  user_id: string;
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
  is_active: boolean;
  isHomeGroup?: boolean;
  created_at: string;
}

export interface SobrietyMilestone {
  id: string;
  user_id: string;
  days: number;
  achieved_at: string;
  celebrated: boolean;
}
