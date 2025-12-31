-- ============================================
-- Steps to Recovery - ENHANCED Supabase Database Schema
-- ============================================
-- This enhanced schema adds missing tables for Phases 3-4 features
-- Run this AFTER the base schema or use this instead
--
-- New tables: daily_checkins, challenges, user_achievements, notifications
-- Dashboard > SQL Editor > New Query > Paste and Run

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- EXISTING TABLES (from base schema)
-- ============================================
-- Profiles, journal_entries, step_work, sponsorships already exist
-- (See supabase-schema.sql for base tables)

-- ============================================
-- NEW TABLES FOR PHASE 3-4
-- ============================================

-- Daily check-ins table (morning intentions & evening pulses)
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  checkin_type TEXT NOT NULL CHECK (checkin_type IN ('morning', 'evening')),

  -- Morning intention fields
  intention TEXT,
  gratitude TEXT,

  -- Evening pulse fields
  day_rating INTEGER CHECK (day_rating BETWEEN 1 AND 10),
  challenges_faced TEXT,
  wins TEXT,

  -- Shared fields
  mood TEXT,
  notes TEXT, -- Additional encrypted notes

  checkin_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one check-in of each type per day
  UNIQUE(user_id, checkin_date, checkin_type)
);

-- Challenges table (streak tracking, milestone tracking)
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('sobriety_streak', 'journal_streak', 'meeting_streak', 'custom')),

  name TEXT NOT NULL,
  description TEXT,
  target_days INTEGER, -- For custom challenges

  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0, -- Total completions ever

  start_date DATE,
  last_completed_date DATE,

  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements (milestone badges)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('sobriety_milestone', 'journal_milestone', 'meeting_milestone', 'step_completion', 'custom')),

  milestone_value INTEGER NOT NULL, -- e.g., 1, 7, 30, 60, 90 days
  achievement_name TEXT NOT NULL, -- "1 Day Sober", "30 Day Chip"
  description TEXT,
  icon_name TEXT, -- For UI display

  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, achievement_type, milestone_value)
);

-- Notifications table (scheduled and sent notifications)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('daily_reminder', 'milestone_celebration', 'sponsor_message', 'geofence_alert', 'custom')),

  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB, -- Additional payload data

  scheduled_for TIMESTAMPTZ, -- When to send (null if immediate)
  sent_at TIMESTAMPTZ, -- When actually sent
  read_at TIMESTAMPTZ, -- When user opened it

  is_scheduled BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Geofences table (user-defined risky locations or safe spaces)
CREATE TABLE IF NOT EXISTS geofences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  name TEXT NOT NULL, -- "Home Group", "Bar on 5th St"
  location_type TEXT NOT NULL CHECK (location_type IN ('risky', 'safe')),

  latitude FLOAT NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude FLOAT NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  radius_meters INTEGER NOT NULL CHECK (radius_meters > 0),

  alert_on_entry BOOLEAN DEFAULT TRUE,
  alert_on_exit BOOLEAN DEFAULT FALSE,
  alert_message TEXT,

  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting attendance table (for tracking meetings)
CREATE TABLE IF NOT EXISTS meeting_attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  meeting_name TEXT,
  meeting_location TEXT,
  meeting_type TEXT, -- "AA", "NA", "Al-Anon", etc.

  attended_at TIMESTAMPTZ NOT NULL,
  notes TEXT, -- Reflections from the meeting

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR NEW TABLES
-- ============================================

-- Daily check-ins
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON daily_checkins(user_id, checkin_date DESC);
CREATE INDEX IF NOT EXISTS idx_checkins_type ON daily_checkins(user_id, checkin_type);

-- Challenges
CREATE INDEX IF NOT EXISTS idx_challenges_user ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_active ON challenges(user_id, is_active);

-- Achievements
CREATE INDEX IF NOT EXISTS idx_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON user_achievements(user_id, achievement_type);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(user_id, is_scheduled, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- Geofences
CREATE INDEX IF NOT EXISTS idx_geofences_user ON geofences(user_id);
CREATE INDEX IF NOT EXISTS idx_geofences_active ON geofences(user_id, is_active);

-- Meeting attendance
CREATE INDEX IF NOT EXISTS idx_meetings_user ON meeting_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meeting_attendance(user_id, attended_at DESC);

-- ============================================
-- TRIGGERS (Auto-update timestamps)
-- ============================================

-- Apply updated_at triggers to new tables
CREATE TRIGGER update_daily_checkins_updated_at
  BEFORE UPDATE ON daily_checkins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_geofences_updated_at
  BEFORE UPDATE ON geofences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meeting_attendance_updated_at
  BEFORE UPDATE ON meeting_attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW-LEVEL SECURITY (RLS) FOR NEW TABLES
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendance ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DAILY CHECK-INS POLICIES
-- ============================================

CREATE POLICY "Users can view own check-ins"
  ON daily_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins"
  ON daily_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins"
  ON daily_checkins FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own check-ins"
  ON daily_checkins FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CHALLENGES POLICIES
-- ============================================

CREATE POLICY "Users can view own challenges"
  ON challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges"
  ON challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges"
  ON challenges FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges"
  ON challenges FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- USER ACHIEVEMENTS POLICIES
-- ============================================

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Achievements typically shouldn't be updated or deleted
-- But allow deletion for data cleanup
CREATE POLICY "Users can delete own achievements"
  ON user_achievements FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- GEOFENCES POLICIES
-- ============================================

CREATE POLICY "Users can view own geofences"
  ON geofences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own geofences"
  ON geofences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own geofences"
  ON geofences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own geofences"
  ON geofences FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MEETING ATTENDANCE POLICIES
-- ============================================

CREATE POLICY "Users can view own meeting attendance"
  ON meeting_attendance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meeting attendance"
  ON meeting_attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meeting attendance"
  ON meeting_attendance FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meeting attendance"
  ON meeting_attendance FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to calculate current sobriety streak
CREATE OR REPLACE FUNCTION get_sobriety_days(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_sobriety_start_date DATE;
  v_days INTEGER;
BEGIN
  SELECT sobriety_start_date INTO v_sobriety_start_date
  FROM profiles
  WHERE id = p_user_id;

  IF v_sobriety_start_date IS NULL THEN
    RETURN 0;
  END IF;

  v_days := CURRENT_DATE - v_sobriety_start_date;
  RETURN GREATEST(v_days, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user achieved a milestone today
CREATE OR REPLACE FUNCTION check_milestone_achievement(p_user_id UUID, p_days INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM user_achievements
    WHERE user_id = p_user_id
    AND achievement_type = 'sobriety_milestone'
    AND milestone_value = p_days
  ) INTO v_exists;

  RETURN v_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Uncomment to verify new tables:
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('daily_checkins', 'challenges', 'user_achievements', 'notifications', 'geofences', 'meeting_attendance');

-- Verify RLS policies:
-- SELECT schemaname, tablename, policyname
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
