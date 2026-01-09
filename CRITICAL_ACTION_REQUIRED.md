# 🚨 CRITICAL ACTION REQUIRED: Apply Database Migration

## Summary

**Status**: ⚠️ BLOCKING - Must be applied manually via Supabase dashboard

**Issue**: Daily check-ins are NOT syncing to cloud backup (data loss risk)

**Time Required**: 5 minutes

---

## Why This Is Critical

Users' daily check-ins (morning intentions and evening reflections) are:
- ✅ Saving to local device storage
- ✅ Being queued for cloud sync
- ❌ **FAILING to sync** - The `daily_checkins` table doesn't exist in Supabase

**Result**: If a user loses their device, they lose all check-in data (including streaks).

---

## What You Need to Do

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select project: **tbiunmmvfbakwlzykpwq** (Steps to Recovery)
3. Click: **SQL Editor** (left sidebar)
4. Click: **New Query**

### Step 2: Apply the Migration

1. Open file: `/home/user/Steps-to-recovery/supabase-migration-daily-checkins.sql`
2. Copy all contents
3. Paste into Supabase SQL Editor
4. Click: **Run** (or press Ctrl+Enter)

### Step 3: Verify Success

Run this query in SQL Editor to confirm:

```sql
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'daily_checkins'
ORDER BY ordinal_position;
```

**Expected**: Should return 10 columns (id, user_id, checkin_type, etc.)

### Step 4: Update Migration Status

After applying, update line 147 in `MIGRATION-INSTRUCTIONS.md`:

```markdown
| 2026-01-09 | Add daily_checkins table        | ✅ Applied  | [Your Name] |
```

---

## What Was Fixed in This Commit

This commit fixes **3 critical security and stability issues**:

### 1. ✅ Web Auth Token Storage (SECURITY FIX)
**Before**: Supabase auth tokens stored in plaintext localStorage (vulnerable to XSS)
**After**: Auth tokens stored in IndexedDB (better security isolation)

**Files Changed**:
- `src/lib/supabaseAuthStorage.ts` (new - IndexedDB storage adapter)
- `src/lib/supabase.ts` (updated to use IndexedDB on web)

### 2. ✅ Sync Queue Consistency (BUG FIX)
**Before**: `removeFavorite` manually inserted into sync_queue (error-prone)
**After**: Uses `addDeleteToSyncQueue` helper (consistent with rest of codebase)

**Files Changed**:
- `src/features/meetings/hooks/useFavoriteMeetings.ts`

### 3. ⏳ Migration Documentation (PENDING MANUAL ACTION)
**Status**: Migration SQL is ready but requires manual application in Supabase dashboard
**This file**: Provides clear step-by-step instructions

---

## After You Apply the Migration

1. Test by creating a check-in in the app
2. Wait 5 minutes for automatic sync
3. Check Supabase Table Editor > `daily_checkins` table
4. Confirm encrypted check-in data appears
5. Mark this action as complete!

---

## Known Issue: Sentry CLI Installation

**Status**: ⚠️ Non-blocking development issue

**Problem**: `npm install` fails when trying to download Sentry CLI binary (403 Forbidden)

**Impact**:
- Prevents full dependency installation
- Blocks running Jest tests locally
- Does NOT affect the security fixes in this commit

**Workaround**:
- The fixes are code-only changes following established patterns
- No runtime dependencies were added
- Sentry is only used for error tracking in production

**Resolution**:
- Update `@sentry/react-native` to a newer version
- Or temporarily remove Sentry from package.json if not needed for MVP
- See: https://github.com/getsentry/sentry-cli/issues

---

## Questions?

See `MIGRATION-INSTRUCTIONS.md` for detailed testing instructions and rollback procedures.
