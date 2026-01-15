# Prioritized Fix Plan - Steps to Recovery

**Date**: 2026-01-15  
**Status**: Ready for Execution  
**Baseline**: Phase B Complete | All 181 tests passing ✅

---

## Executive Summary

**Current State**: ✅ Healthy foundation (TypeScript clean, tests passing)  
**Primary Gaps**: Missing linter, unverified CI/CD, minimal integration tests  
**Recommended Approach**: High-impact, low-risk improvements first

---

## Priority Matrix

| Priority | Item | Impact | Effort | Risk |
|----------|------|--------|--------|------|
| **P0** | Add ESLint Configuration | HIGH | LOW | LOW |
| **P0** | Verify CI/CD Workflows | HIGH | LOW | LOW |
| **P1** | Add Integration Tests (Auth) | HIGH | MEDIUM | LOW |
| **P1** | Add Integration Tests (Sync) | HIGH | MEDIUM | LOW |
| **P2** | Android Build Verification | MEDIUM | LOW | MEDIUM |
| **P2** | Resolve TODO Comments | MEDIUM | LOW | LOW |
| **P3** | Increase Test Coverage | MEDIUM | HIGH | LOW |
| **P3** | Add Pre-Commit Hooks | LOW | LOW | LOW |
| **P4** | Document Deployment Process | LOW | MEDIUM | LOW |
| **P4** | Add E2E Tests (Detox) | LOW | HIGH | MEDIUM |
| **P5** | iOS Build Verification | LOW | LOW | MEDIUM |
| **P5** | Supabase Schema Drift Check | LOW | LOW | LOW |

---

## Detailed Fix Plan

### **P0-1: Add ESLint Configuration** 🔴 CRITICAL

**Why**: `turbo.json` defines `lint` task but no ESLint config exists. CI workflow references missing config.

**Hypothesis**: Missing ESLint config causes CI failures and prevents code quality checks.

**Options Considered**:

1. ✅ **Add ESLint with Expo preset** (recommended)
2. ❌ Remove lint task from Turbo (loses code quality checks)
3. ❌ Use Prettier only (no linting, just formatting)

**Change**:

```bash
# Install ESLint + Expo preset
cd apps/mobile
npm install --save-dev eslint @expo/eslint-config

# Create .eslintrc.js
cat > .eslintrc.js << 'EOF'
module.exports = {
  extends: ['expo', 'prettier'],
  rules: {
    // Enforce no console.log (use logger instead)
    'no-console': ['error', { allow: ['warn', 'error'] }],
    // Enforce explicit return types (CLAUDE.md requirement)
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
    }],
  },
};
EOF

# Add lint script to package.json
npm pkg set scripts.lint="eslint src --ext .ts,.tsx --max-warnings 0"
```

**Verification**:

- [ ] Run `npm run lint` (should pass with 0 warnings)
- [ ] Verify `turbo run lint` works
- [ ] Check CI workflow executes successfully

**Rollback**: Remove `.eslintrc.js`, uninstall eslint packages

**Estimated Time**: 15 minutes

---

### **P0-2: Verify CI/CD Workflows** 🔴 CRITICAL

**Why**: 4 GitHub Actions workflows exist but no evidence they run successfully.

**Hypothesis**: Workflows may fail due to missing ESLint config or outdated actions.

**Options Considered**:

1. ✅ **Fix workflows to run on push/PR** (recommended)
2. ❌ Disable workflows (loses automated checks)
3. ❌ Migrate to different CI (unnecessary churn)

**Change**:

1. Review `.github/workflows/eslint.yml` (likely failing due to missing config)
2. Update workflow to use `npm run lint` after P0-1 fix
3. Verify `codacy.yml`, `appknox.yml`, `webpack.yml` are still relevant
4. Add status badges to `README.md`

**Verification**:

- [ ] Push to branch, verify workflows run
- [ ] Check GitHub Actions tab for green checkmarks
- [ ] Verify ESLint workflow passes after P0-1

**Rollback**: Revert workflow file changes

**Estimated Time**: 30 minutes

---

### **P1-1: Add Integration Tests (Auth Flow)** 🟠 HIGH PRIORITY

**Why**: Auth is security-critical but lacks integration tests. Only unit tests exist.

**Hypothesis**: Auth flow (login → session → logout → cleanup) needs end-to-end verification.

**Options Considered**:

1. ✅ **Add integration tests with mocked Supabase** (recommended)
2. ❌ Add E2E tests with real Supabase (too slow for CI)
3. ❌ Skip tests (unacceptable for security-critical code)

**Change**:
Create `src/contexts/__tests__/AuthContext.integration.test.tsx`:

```typescript
describe('AuthContext Integration', () => {
  it('should handle full auth lifecycle', async () => {
    // 1. Login
    // 2. Verify session stored
    // 3. Verify encryption key generated
    // 4. Logout
    // 5. Verify session cleared
    // 6. Verify encryption key deleted
    // 7. Verify database cleared
  });

  it('should handle session expiry', async () => {
    // Mock expired JWT
    // Verify refresh token rotation
  });

  it('should prevent access without auth', async () => {
    // Verify RLS policies enforced
  });
});
```

**Verification**:

- [ ] Run `npm test -- AuthContext.integration.test.tsx`
- [ ] Verify all assertions pass
- [ ] Check coverage increases for `AuthContext.tsx`

**Rollback**: Delete test file

**Estimated Time**: 2 hours

---

### **P1-2: Add Integration Tests (Sync Queue)** 🟠 HIGH PRIORITY

**Why**: Sync queue is complex (retry logic, exponential backoff, delete-before-insert) and lacks integration tests.

**Hypothesis**: Sync queue edge cases (network interruption, FK conflicts) need verification.

**Options Considered**:

1. ✅ **Add integration tests with mocked Supabase** (recommended)
2. ❌ Add E2E tests with real Supabase (too slow)
3. ❌ Rely on unit tests only (insufficient coverage)

**Change**:
Create `src/services/__tests__/syncService.integration.test.ts`:

```typescript
describe('Sync Queue Integration', () => {
  it('should process deletes before inserts', async () => {
    // Queue: delete journal_entry, insert journal_entry
    // Verify delete processed first
  });

  it('should handle network interruption', async () => {
    // Mock network timeout mid-sync
    // Verify retry logic kicks in
  });

  it('should handle FK conflicts gracefully', async () => {
    // Queue: delete user, insert journal (FK to user)
    // Verify delete processed first, no FK error
  });

  it('should apply exponential backoff', async () => {
    // Mock 3 failures
    // Verify delays: 1s, 2s, 4s
  });
});
```

**Verification**:

- [ ] Run `npm test -- syncService.integration.test.ts`
- [ ] Verify all assertions pass
- [ ] Check coverage increases for `syncService.ts`

**Rollback**: Delete test file

**Estimated Time**: 3 hours

---

### **P2-1: Android Build Verification** 🟡 MEDIUM PRIORITY

**Why**: Android build has not been executed in this assessment. Runtime issues unknown.

**Hypothesis**: Build will succeed, but native modules (expo-sqlite, expo-secure-store) need device testing.

**Options Considered**:

1. ✅ **Run on emulator + physical device** (recommended)
2. ❌ Skip verification (risky for release)
3. ❌ Use EAS Build only (slower feedback loop)

**Change**:

```bash
# Start Android emulator (if available)
emulator -avd Pixel_5_API_35

# Build and run
cd apps/mobile
npm run android

# Smoke test checklist:
# 1. App launches without crash
# 2. Login works
# 3. Create journal entry (encryption works)
# 4. Sync to cloud (network works)
# 5. Logout (cleanup works)
```

**Verification**:

- [ ] App builds successfully (no Gradle errors)
- [ ] App launches on emulator
- [ ] Smoke test checklist passes
- [ ] No native module errors in logs

**Rollback**: N/A (read-only verification)

**Estimated Time**: 1 hour (if emulator available)

---

### **P2-2: Resolve TODO Comments** 🟡 MEDIUM PRIORITY

**Why**: 6 TODO comments found in production code (analytics, notifications, readings, meetings).

**Hypothesis**: TODOs represent incomplete features or technical debt.

**Options Considered**:

1. ✅ **Track in backlog or implement** (recommended)
2. ❌ Ignore (loses visibility)
3. ❌ Remove comments (loses context)

**Change**:

1. Review each TODO:
   - `utils/analytics.ts` - Implement or track
   - `notifications/index.ts` - Implement or track
   - `store/readingStore.ts` - Implement or track
   - `store/regularMeetingStore.ts` - Implement or track
   - `hooks/useReading.ts` - Implement or track
   - `hooks/useRegularMeetings.ts` - Implement or track

2. For each TODO:
   - If quick fix (\u003c1 hour): Implement now
   - If complex: Create GitHub issue, link in comment

**Verification**:

- [ ] All TODOs either resolved or tracked
- [ ] No orphaned TODO comments

**Rollback**: Revert code changes

**Estimated Time**: 2-4 hours (depends on TODO complexity)

---

### **P3-1: Increase Test Coverage** 🟢 LOW PRIORITY

**Why**: Current coverage: 40% global, 90% encryption. Goal: 60% global.

**Hypothesis**: Adding tests for `DatabaseContext`, `SyncContext`, `NotificationContext` will increase coverage.

**Options Considered**:

1. ✅ **Add unit tests for contexts** (recommended)
2. ❌ Add E2E tests only (slower, less granular)
3. ❌ Skip (acceptable for MVP, but risky long-term)

**Change**:
Create tests for:

- `src/contexts/__tests__/DatabaseContext.test.tsx`
- `src/contexts/__tests__/NotificationContext.test.tsx`
- `src/utils/__tests__/database.test.ts` (migration tests)

**Verification**:

- [ ] Run `npm run test:coverage`
- [ ] Verify global coverage \u003e= 60%
- [ ] Verify no critical paths \u003c 70%

**Rollback**: Delete test files

**Estimated Time**: 4-6 hours

---

### **P3-2: Add Pre-Commit Hooks** 🟢 LOW PRIORITY

**Why**: Prevent commits with failing tests or type errors.

**Hypothesis**: Pre-commit hooks will catch errors before CI.

**Options Considered**:

1. ✅ **Use Husky + lint-staged** (recommended)
2. ❌ Rely on CI only (slower feedback)
3. ❌ Use Git hooks directly (less portable)

**Change**:

```bash
# Install Husky + lint-staged
npm install --save-dev husky lint-staged

# Initialize Husky
npx husky init

# Add pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
npx lint-staged
EOF

# Configure lint-staged in package.json
npm pkg set lint-staged='{"*.{ts,tsx}": ["eslint --fix", "npm run type-check"]}'
```

**Verification**:

- [ ] Make a commit with type error
- [ ] Verify commit blocked
- [ ] Fix error, verify commit succeeds

**Rollback**: Remove Husky, uninstall packages

**Estimated Time**: 30 minutes

---

### **P4-1: Document Deployment Process** 🟢 LOW PRIORITY

**Why**: No documented deployment process for Android/iOS releases.

**Hypothesis**: Deployment process is tribal knowledge, needs documentation.

**Change**:
Create `DEPLOYMENT.md` (update existing file):

```markdown
# Deployment Guide

## Android (Google Play)
1. Update version in `app.json`
2. Run `eas build --platform android --profile production`
3. Download AAB from EAS dashboard
4. Upload to Google Play Console (Internal Testing)
5. Promote to Production after testing

## iOS (App Store)
1. Update version in `app.json`
2. Run `eas build --platform ios --profile production`
3. Download IPA from EAS dashboard
4. Upload to App Store Connect via Transporter
5. Submit for review

## Pre-Release Checklist
- [ ] All tests passing
- [ ] Type check clean
- [ ] Android smoke test
- [ ] iOS smoke test
- [ ] Changelog updated
```

**Verification**:

- [ ] Review with team
- [ ] Test deployment process

**Rollback**: Revert file changes

**Estimated Time**: 1 hour

---

### **P4-2: Add E2E Tests (Detox)** 🟢 LOW PRIORITY

**Why**: No E2E tests for critical user flows (login, journal, sync).

**Hypothesis**: E2E tests will catch integration issues missed by unit tests.

**Options Considered**:

1. ✅ **Use Detox (React Native standard)** (recommended)
2. ❌ Use Maestro (newer, less mature)
3. ❌ Skip E2E tests (acceptable for MVP)

**Change**:

```bash
# Install Detox
npm install --save-dev detox

# Initialize Detox
npx detox init

# Create test: e2e/auth.e2e.ts
describe('Auth Flow', () => {
  it('should login and logout', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
    await element(by.id('logout-button')).tap();
    await expect(element(by.id('login-screen'))).toBeVisible();
  });
});
```

**Verification**:

- [ ] Run `detox test`
- [ ] Verify tests pass on emulator

**Rollback**: Remove Detox, delete e2e folder

**Estimated Time**: 4-6 hours

---

### **P5-1: iOS Build Verification** 🟢 LOW PRIORITY

**Why**: iOS build not verified (requires macOS).

**Hypothesis**: Build will succeed, but needs device testing.

**Change**:

```bash
# Run on iOS simulator (macOS only)
cd apps/mobile
npm run ios

# Smoke test checklist (same as Android)
```

**Verification**:

- [ ] App builds successfully
- [ ] App launches on simulator
- [ ] Smoke test checklist passes

**Rollback**: N/A (read-only verification)

**Estimated Time**: 1 hour (if macOS available)

---

### **P5-2: Supabase Schema Drift Check** 🟢 LOW PRIORITY

**Why**: Local schema (database.ts) and Supabase migrations may drift over time.

**Hypothesis**: Schema drift can cause sync failures.

**Change**:

```bash
# Run Supabase diff
cd supabase
supabase db diff --schema public

# Review output for unexpected changes
```

**Verification**:

- [ ] Run `supabase db diff`
- [ ] Verify no unexpected schema changes
- [ ] Document any intentional drift

**Rollback**: N/A (read-only check)

**Estimated Time**: 15 minutes

---

## Execution Plan (Recommended Order)

### Week 1 (High-Impact, Low-Effort)

1. **Day 1**: P0-1 (ESLint) + P0-2 (CI/CD) - 1 hour total
2. **Day 2**: P2-1 (Android Build) - 1 hour
3. **Day 3**: P1-1 (Auth Integration Tests) - 2 hours
4. **Day 4**: P1-2 (Sync Integration Tests) - 3 hours
5. **Day 5**: P2-2 (Resolve TODOs) - 2-4 hours

### Week 2 (Medium-Impact)

1. **Day 1-2**: P3-1 (Increase Coverage) - 4-6 hours
2. **Day 3**: P3-2 (Pre-Commit Hooks) - 30 minutes
3. **Day 4**: P4-1 (Deployment Docs) - 1 hour
4. **Day 5**: P5-2 (Schema Drift Check) - 15 minutes

### Week 3 (Optional)

1. **Day 1-2**: P4-2 (E2E Tests) - 4-6 hours
2. **Day 3**: P5-1 (iOS Build) - 1 hour (if macOS available)

---

## Success Criteria

### Phase A Complete When

- ✅ ESLint configured and passing
- ✅ CI/CD workflows green
- ✅ Auth integration tests added (coverage \u003e= 80%)
- ✅ Sync integration tests added (coverage \u003e= 70%)
- ✅ Android build verified on emulator
- ✅ All TODOs resolved or tracked
- ✅ Global test coverage \u003e= 60%

### Stretch Goals

- ✅ Pre-commit hooks enabled
- ✅ Deployment process documented
- ✅ E2E tests added (1-2 critical flows)
- ✅ iOS build verified

---

**Plan Ready**: Prioritized by impact and effort  
**Next Step**: Execute P0-1 (ESLint Configuration)  
**Estimated Total Time**: 15-25 hours (spread over 2-3 weeks)
