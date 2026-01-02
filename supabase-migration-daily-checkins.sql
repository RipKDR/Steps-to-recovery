-- ============================================
-- Supabase Migration: Add daily_checkins Table
-- ============================================
-- This migration adds the missing daily_checkins table
-- that is currently blocking cloud sync for check-ins.
--
-- The schema matches what the sync service expects:
-- - Morning check-ins: intention, mood (encrypted)
-- - Evening check-ins: notes (reflection), mood, challenges_faced (craving) (encrypted)
--
-- Run this in Supabase SQL Editor:
-- Dashboard > SQL Editor > New Query > Paste and Run

-- ============================================
-- CREATE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Check-in metadata
  checkin_type TEXT NOT NULL CHECK (checkin_type IN ('morning', 'evening')),
  checkin_date DATE NOT NULL,

  -- Morning check-in fields (all encrypted client-side)
  intention TEXT,        -- Encrypted morning intention

  -- Evening check-in fields (all encrypted client-side)
  notes TEXT,            -- Encrypted evening reflection
  challenges_faced TEXT, -- Encrypted craving level (0-10)

  -- Shared fields
  mood TEXT,             -- Encrypted mood rating (1-5) for both morning and evening

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one check-in of each type per day per user
  UNIQUE(user_id, checkin_date, checkin_type)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_checkins_user_date
  ON daily_checkins(user_id, checkin_date DESC);

CREATE INDEX IF NOT EXISTS idx_checkins_type
  ON daily_checkins(user_id, checkin_type);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
-- (Assumes update_updated_at_column() function exists from base schema)
CREATE TRIGGER update_daily_checkins_updated_at
  BEFORE UPDATE ON daily_checkins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

-- Users can view their own check-ins
CREATE POLICY "Users can view own check-ins"
  ON daily_checkins FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own check-ins
CREATE POLICY "Users can insert own check-ins"
  ON daily_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own check-ins
CREATE POLICY "Users can update own check-ins"
  ON daily_checkins FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own check-ins
CREATE POLICY "Users can delete own check-ins"
  ON daily_checkins FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Uncomment to verify the table was created:
-- SELECT table_name, column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'daily_checkins'
-- ORDER BY ordinal_position;

-- Verify RLS policies:
-- SELECT policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename = 'daily_checkins';
