# Supabase Connection & Migration Test

## Project Information

**Supabase Project**: `tbiunmmvfbakwlzykpwq`
**URL**: https://tbiunmmvfbakwlzykpwq.supabase.co
**Dashboard**: https://supabase.com/dashboard/project/tbiunmmvfbakwlzykpwq

---

## ⚠️ CRITICAL: daily_checkins Migration Required

### Current Status

- ✅ **Local storage working**: Check-ins save to SQLite/IndexedDB
- ✅ **Sync queue working**: Check-ins queued for cloud sync
- ❌ **Cloud backup FAILING**: `daily_checkins` table doesn't exist in Supabase

**RISK**: Users' check-in data (morning intentions, evening reflections) is NOT backed up to cloud!

---

## Quick Start: Apply Migration Now

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/tbiunmmvfbakwlzykpwq
2. Click: **SQL Editor** (left sidebar)
3. Click: **New Query** button

### Step 2: Run Migration SQL

1. Open file: `supabase-migration-daily-checkins.sql` (in project root)
2. Copy entire contents (105 lines)
3. Paste into SQL Editor
4. Click: **Run** (or press Ctrl+Enter / Cmd+Enter)

### Step 3: Verify Success

You should see:
```
✅ CREATE TABLE
✅ CREATE INDEX (2x)
✅ CREATE TRIGGER
✅ ALTER TABLE (Enable RLS)
✅ CREATE POLICY (4x)
```

**If errors occur**: Check if table already exists, or contact support.

---

## Detailed Verification Steps

### Test 1: Verify Table Exists

**Run this in SQL Editor:**
```sql
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'daily_checkins'
ORDER BY ordinal_position;
```

**Expected Result**: 9 columns
| column_name | data_type | is_nullable |
|-------------|-----------|-------------|
| id | uuid | NO |
| user_id | uuid | NO |
| checkin_type | text | NO |
| checkin_date | date | NO |
| intention | text | YES |
| notes | text | YES |
| challenges_faced | text | YES |
| mood | text | YES |
| created_at | timestamptz | YES |
| updated_at | timestamptz | YES |

---

### Test 2: Verify RLS Policies

**Run this in SQL Editor:**
```sql
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'daily_checkins';
```

**Expected Result**: 4 policies
1. ✅ `Users can view their own check-ins` (SELECT)
2. ✅ `Users can create their own check-ins` (INSERT)
3. ✅ `Users can update their own check-ins` (UPDATE)
4. ✅ `Users can delete their own check-ins` (DELETE)

All policies should filter by: `(user_id = auth.uid())`

---

### Test 3: Verify Indexes

**Run this in SQL Editor:**
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'daily_checkins';
```

**Expected Result**: 3 indexes
1. ✅ `daily_checkins_pkey` (PRIMARY KEY on id)
2. ✅ `idx_checkins_user_date` (user_id, checkin_date DESC)
3. ✅ `daily_checkins_user_id_checkin_date_checkin_type_key` (UNIQUE constraint)

---

### Test 4: Verify Trigger (Auto-Update Timestamp)

**Run this in SQL Editor:**
```sql
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'daily_checkins';
```

**Expected Result**: 1 trigger
- ✅ `update_daily_checkins_updated_at` (BEFORE UPDATE)
- Action: Sets `updated_at = NOW()`

---

### Test 5: Insert Test Data

**Run this in SQL Editor:**
```sql
-- Get your user ID first
SELECT id FROM auth.users LIMIT 1;

-- Insert test morning check-in (replace USER_ID_HERE)
INSERT INTO daily_checkins (
  user_id,
  checkin_type,
  checkin_date,
  intention,
  mood
) VALUES (
  'USER_ID_HERE'::uuid,
  'morning',
  CURRENT_DATE,
  'encrypted_test_intention',
  'encrypted_mood_4'
);

-- Verify it was inserted
SELECT * FROM daily_checkins WHERE user_id = 'USER_ID_HERE'::uuid;
```

**Expected Result**: 1 row returned with your test data

**Clean up test data:**
```sql
DELETE FROM daily_checkins WHERE intention = 'encrypted_test_intention';
```

---

### Test 6: Test RLS (Row-Level Security)

**This should FAIL (unauthorized access):**
```sql
-- Try to access someone else's check-ins
SELECT * FROM daily_checkins WHERE user_id != auth.uid();
```

**Expected Result**: 0 rows (or error if no other users exist)

**This should SUCCEED:**
```sql
-- Access your own check-ins
SELECT * FROM daily_checkins WHERE user_id = auth.uid();
```

**Expected Result**: Only your check-ins returned

---

## Test App Integration

### After Migration: Test Sync

1. **Open the mobile app**
2. **Create a morning check-in**:
   - Go to Home screen
   - Tap "Morning Check-In"
   - Enter intention and mood
   - Save

3. **Trigger sync** (one of these):
   - Wait 5 minutes (automatic sync)
   - Force quit and reopen app
   - Toggle airplane mode off (triggers network reconnect sync)

4. **Verify in Supabase**:
```sql
SELECT
  id,
  checkin_type,
  checkin_date,
  LENGTH(intention) as intention_length,
  LENGTH(mood) as mood_length,
  created_at
FROM daily_checkins
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result**: Your check-in appears with encrypted data (long encrypted strings)

---

## Troubleshooting

### Error: "relation 'daily_checkins' already exists"

**Solution**: Table already exists! Skip to verification steps.

### Error: "permission denied for schema public"

**Solution**:
1. Check you're logged into correct Supabase project
2. Verify you have admin access to project
3. Contact project owner

### Error: "uuid_generate_v4() does not exist"

**Solution**: Run this first:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Sync still not working after migration

**Check:**
1. ✅ Table exists in Supabase
2. ✅ RLS policies are enabled
3. ✅ App has internet connection
4. ✅ User is logged in
5. ✅ Check sync queue: `SELECT * FROM sync_queue WHERE table_name = 'daily_checkins'`

**View sync errors:**
```typescript
// In React Native debugger console
import { logger } from './src/utils/logger';
logger.debug('Check sync queue');
```

---

## Success Checklist

Before marking complete, verify all these:

- [ ] Migration SQL executed successfully
- [ ] Table `daily_checkins` exists
- [ ] 9 columns present (id, user_id, checkin_type, etc.)
- [ ] RLS enabled on table
- [ ] 4 RLS policies exist and work correctly
- [ ] 2 indexes created (user_date + unique constraint)
- [ ] 1 trigger created (update_updated_at)
- [ ] Test insert works
- [ ] Test RLS blocks unauthorized access
- [ ] App sync working (check-in appears in Supabase)
- [ ] No errors in app logs
- [ ] Data is encrypted (long strings, not readable)

---

## Post-Migration Verification

### Check All Tables Exist

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected Tables:**
- achievements
- daily_checkins ✨ (NEW!)
- journal_entries
- shared_entries
- sponsorships
- step_work
- sync_queue
- user_profiles

### Check Total Row Counts

```sql
SELECT
  'daily_checkins' as table_name,
  COUNT(*) as row_count
FROM daily_checkins
UNION ALL
SELECT 'journal_entries', COUNT(*) FROM journal_entries
UNION ALL
SELECT 'step_work', COUNT(*) FROM step_work
ORDER BY table_name;
```

---

## Next Steps After Migration

1. ✅ **Test the app** - Create check-ins and verify sync
2. ✅ **Monitor sync queue** - Ensure items process successfully
3. ✅ **Check logs** - No errors related to daily_checkins
4. ✅ **Backup database** - Supabase dashboard → Database → Backups
5. ✅ **Document completion** - Update project status

---

**Migration completed by**: ________________

**Date**: ________________

**Verification status**: ________________
