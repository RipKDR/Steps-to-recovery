// Core data types for the recovery app

export interface User {
  id: string;
  email: string;
  sobrietyStartDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string; // Encrypted on device
  mood?: 'happy' | 'neutral' | 'sad' | 'anxious' | 'craving';
  tags?: string[];
  isShared: boolean;
  sharedWith?: string[]; // Array of sponsor user IDs
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'synced' | 'pending' | 'error';
}

export interface StepWork {
  id: string;
  userId: string;
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  content: string; // Encrypted on device
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'synced' | 'pending' | 'error';
}

export interface Sponsorship {
  id: string;
  sponsorId: string;
  sponseeId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

export interface Meeting {
  id: string;
  userId: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  attendedAt?: Date;
  notes?: string;
  createdAt: Date;
}

export interface Milestone {
  id: string;
  userId: string;
  type: 'sobriety' | 'meetings' | 'journaling' | 'custom';
  days: number;
  achievedAt: Date;
}

export interface Challenge {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: 'meetings' | 'journaling' | 'custom';
  target: number;
  current: number;
  startDate: Date;
  endDate?: Date;
  isCompleted: boolean;
}
