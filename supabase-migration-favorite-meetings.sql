-- ============================================
-- Supabase Migration: Add favorite_meetings Table
-- ============================================
-- This migration adds the favorite_meetings table for the Meeting Finder feature.
--
-- The schema supports:
-- - User's favorited meetings (behavioral data - encrypted client-side)
-- - Optional personal notes about meetings (encrypted)
-- - Notification preferences for geofencing (future feature)
--
-- IMPORTANT: Meeting data itself (times, locations) is public and cached locally.
-- Only user's favorites list and personal notes are synced to Supabase (encrypted).
--
-- Run this in Supabase SQL Editor:
-- Dashboard > SQL Editor > New Query > Paste and Run

-- ============================================
-- CREATE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS favorite_meetings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Meeting reference (ID from Meeting Guide API or local cache)
  meeting_id TEXT NOT NULL,

  -- User's personal notes about this meeting (encrypted client-side)
  notes TEXT,

  -- Notification preferences (for future geofencing feature)
  notification_enabled BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure user can't favorite the same meeting twice
  UNIQUE(user_id, meeting_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_favorite_meetings_user
  ON favorite_meetings(user_id);

CREATE INDEX IF NOT EXISTS idx_favorite_meetings_user_created
  ON favorite_meetings(user_id, created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
-- (Assumes update_updated_at_column() function exists from base schema)
CREATE TRIGGER update_favorite_meetings_updated_at
  BEFORE UPDATE ON favorite_meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE favorite_meetings ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorite meetings
CREATE POLICY "Users can view own favorite meetings"
  ON favorite_meetings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own favorite meetings
CREATE POLICY "Users can insert own favorite meetings"
  ON favorite_meetings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own favorite meetings
CREATE POLICY "Users can update own favorite meetings"
  ON favorite_meetings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorite meetings
CREATE POLICY "Users can delete own favorite meetings"
  ON favorite_meetings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Uncomment to verify the table was created:
-- SELECT table_name, column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'favorite_meetings'
-- ORDER BY ordinal_position;

-- Verify RLS policies:
-- SELECT policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename = 'favorite_meetings';
