# Steps to Recovery - Copilot Instructions

## Project Overview

Privacy-first 12-step recovery companion app built with React Native/Expo. **Core principle**: Encrypt-before-store. All sensitive user data (journals, step work, check-ins) is encrypted client-side before touching SQLite or Supabase.

**Stack**: Expo SDK 54 • TypeScript (strict) • SQLite/IndexedDB (offline-first) • Supabase (backup sync) • React Query • Zustand • NativeWind • Turborepo monorepo

**Supabase Project**: `tbiunmmvfbakwlzykpwq`

### Monorepo Layout & Imports
- `apps/mobile/` - Expo React Native app (primary app)
- `packages/shared/` - Shared types/constants/utils (`@recovery/shared`)
- Path aliases (mobile): `@/` → `apps/mobile/src`, `@/design-system` → design system barrel
- Prefer absolute imports + `import type` for types

### Environment
- Create `apps/mobile/.env` from `apps/mobile/.env.example`
- Required: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Optional: `EXPO_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_ENV=development|production`

## Critical Workflows

### Running the App
```bash
# From workspace root
npm run mobile              # Start Expo dev server
npm run android            # Run on Android
npm run ios                # Run on iOS (macOS only)

# From apps/mobile
npm start                  # Expo dev server
npm run android            # Run on Android
npm run ios                # Run on iOS (macOS only)
npm run web                # Expo web
```

### Quality Checks
```bash
# From workspace root
npm run validate-env       # Check required env vars
npm run lint               # Turborepo lint
npm run test               # Turborepo tests
npm run format:check       # Prettier check

# From apps/mobile
npm run lint               # ESLint
npm run type-check         # TypeScript validation
npm test                   # Jest
npm run test:encryption    # Critical - run after any encryption changes
```

### Database Migrations
When adding/modifying tables:
1. Increment `CURRENT_SCHEMA_VERSION` in `apps/mobile/src/utils/database.ts`
2. Add migration in `runMigrations()` function with `columnExists()` checks
3. Update sync + types if schema changes affect syncable tables
4. Test on BOTH fresh install AND existing data
5. Update Supabase schema: `supabase-schema.sql` (and RLS if applicable)
6. Verify RLS policies with `supabase db diff`

**Never skip**: Column existence checks prevent crashes on re-runs.

### Schema Mapping (Local ↔ Supabase)
Critical differences to remember:

| Local SQLite | Supabase | Notes |
|--------------|----------|-------|
| `encrypted_body` | `content` | Journal entries |
| `encrypted_answer` + `question_number` | `content` | Step work |
| `is_complete` (INTEGER 0/1) | `is_completed` (BOOLEAN) | Step work |
| `check_in_type` | `checkin_type` | Daily check-ins (no underscore) |
| `encrypted_tags` (JSON string) | `tags` (TEXT[]) | Wrap in array |

**Always**: Generate/reuse `supabase_id` (UUID) for idempotent syncs. See `syncService.ts` for patterns.

## Architecture Patterns

### Data Flow (Encryption-First)
```
User Input → encryptContent() → SQLite (encrypted_*) → addToSyncQueue()
→ processSyncQueue() → Supabase.upsert() → Cloud (still encrypted)
```

**Key invariants**:
1. Encrypt BEFORE storage (never plaintext in DB)
2. Keys ONLY in SecureStore (never AsyncStorage/SQLite)
3. Deletes BEFORE inserts (sync queue order)
4. SQLite is source of truth (Supabase is backup)

### Sync Queue Rules
- Any syncable insert/update/delete must call `addToSyncQueue()` (or `addDeleteToSyncQueue()`)
- Set `sync_status` to `pending` on local writes; sync service sets `synced` or `failed`
- Preserve `supabase_id` once set (idempotent upserts)

### Data Classification
- Encrypt all user-generated or behavior-revealing fields (journal, step work, check-ins, reflections, meeting notes)
- Public/reference data stays plaintext (e.g., daily readings, cached meetings)

### Context Hierarchy (App.tsx)
```tsx
<QueryClientProvider>
  <SafeAreaProvider>
    <ThemeProvider>
      <DatabaseProvider>      {/* Init SQLite/IndexedDB */}
        <AuthProvider>        {/* Supabase auth + session */}
          <SyncProvider>      {/* Background sync logic */}
            <NotificationProvider>
              <RootNavigator />
```

**Database first**: Always wrap auth/sync providers inside DatabaseProvider.

### State Management Strategy
- **React Query**: Server state (DB queries, mutations, cache invalidation)
  - Keys: `['journal-entries']`, `['step-work', stepNumber]`, `['daily-checkins', date]`
  - Always `invalidateQueries()` after mutations
- **Zustand**: Client state (settings, UI state) in `apps/mobile/src/store/` and `packages/shared/store/`
- **Context**: Cross-cutting (auth, database, sync, notifications)

**Do NOT**: Mix Zustand for server state or Context for local UI state.

## Code Conventions

### TypeScript (Strict Mode Enforced)
```typescript
// ✅ Explicit types, no 'any'
async function syncEntry(
  db: StorageAdapter,
  entryId: string
): Promise<{ success: boolean; error?: string }> {
  // implementation
}

// ✅ Type imports
import type { JournalEntry, SyncStatus } from '@recovery/shared';

// ❌ Never use 'any' or implicit types
function handleData(data) { } // WRONG
```

### Encryption (AES-256-CBC)
```typescript
import { encryptContent, decryptContent } from '@/utils/encryption';

// ✅ Always encrypt before storage
const encrypted = await encryptContent(userInput);
await db.runAsync(
  'INSERT INTO journal_entries (encrypted_body, ...) VALUES (?, ...)',
  [encrypted, ...]
);

// ✅ Keys stored securely
import { secureStorage } from '@/adapters/secureStorage';
const key = await secureStorage.getItemAsync('journal_encryption_key');
```

**Never log encrypted content or keys**. Use `logger.debug()` with redaction.

### Platform Adapter Pattern
```typescript
// Storage: apps/mobile/src/adapters/storage/
import { createStorageAdapter } from '@/adapters/storage';

const adapter = await createStorageAdapter(nativeDb); // nativeDb required on mobile

// Secure storage: apps/mobile/src/adapters/secureStorage/
// Web: AES-GCM encrypted (less secure than native)
// Native: Keychain/Keystore
```

**Always use adapters** - never import `expo-sqlite` or `idb` directly outside adapters.

### Logging & Error Handling
```typescript
import { logger } from '@/utils/logger';

logger.info('Action completed', { userId });
logger.error('Failed to save entry', error);
```

**Always** use `logger` for logs (auto-redacts). Avoid `console.*` and never log plaintext.

### Haptics
Prefer `utils/haptics` helpers for consistent feedback:
```typescript
import { haptics } from '@/utils/haptics';

await haptics.impact('light');
await haptics.success();
```

### NativeWind (TailwindCSS)
```tsx
// ✅ Use className, support dark mode
<View className="bg-white dark:bg-surface-800 rounded-xl p-4">
  <Text className="text-lg font-semibold text-slate-900 dark:text-white">
    {title}
  </Text>
</View>

// ✅ Use cn() for conditional classes
<View className={cn('px-4', isActive && 'bg-primary')} />

// ✅ Use StyleSheet for animated/complex styles when className isn't enough
const styles = StyleSheet.create({ container: { alignItems: 'center' } });
```

Design tokens: `primary-*`, `secondary-*`, `surface-*`, `accent-*`. Touch targets min 44px.

### Testing Patterns
```typescript
// Mock Supabase in __tests__
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      upsert: jest.fn().mockReturnValue({ error: null }),
    }),
  },
}));

// Mock database adapter
const mockDb: jest.Mocked<StorageAdapter> = {
  getFirstAsync: jest.fn(),
  getAllAsync: jest.fn(),
  runAsync: jest.fn(),
  // ...
};
```

**Coverage targets**: 80%+ for encryption, database, sync. Run `npm run test:encryption` after changes.

## Security Checklist

Before ANY commit touching sensitive data:
- [ ] All user data encrypted with `encryptContent()` before storage
- [ ] Keys stored in SecureStore only (check imports)
- [ ] RLS policies verified on new tables (`user_id = auth.uid()`)
- [ ] No `console.log()` with plaintext sensitive data
- [ ] Sync operations preserve encryption end-to-end
- [ ] Test migration on existing encrypted data

**RLS Pattern** (Supabase):
```sql
CREATE POLICY "Users can only access their own data"
ON journal_entries FOR ALL
USING (auth.uid() = user_id);
```

## Common Pitfalls

1. **Forgetting `supabase_id`**: Always check if exists before generating new UUID in sync functions
2. **Schema drift**: Local SQLite uses `encrypted_*` fields; Supabase uses different names (see table above)
3. **Sync queue order**: Process deletes BEFORE inserts to avoid constraint violations
4. **Boolean conversion**: SQLite uses INTEGER (0/1); Supabase uses BOOLEAN (true/false)
5. **Missing sync queue**: Writes without `addToSyncQueue()` never reach Supabase
6. **Logging plaintext**: Use `logger` so sensitive fields are redacted
7. **Web encryption**: Uses less secure AES-GCM (no SecureStore); warn users

## File Locations

**Core logic**:
- `apps/mobile/src/utils/database.ts` - SQLite schema, migrations
- `apps/mobile/src/utils/encryption.ts` - AES-256-CBC encrypt/decrypt
- `apps/mobile/src/services/syncService.ts` - Sync queue processing
- `apps/mobile/src/lib/supabase.ts` - Supabase client config

**Design system / UI**:
- `apps/mobile/src/design-system/` - Theme tokens, hooks, components
- `apps/mobile/src/components/ui/` - UI primitives (NativeWind + rn-primitives)
- `apps/mobile/src/lib/utils.ts` - `cn()` helper for className merging

**Contexts**:
- `apps/mobile/src/contexts/AuthContext.tsx` - Supabase auth + session
- `apps/mobile/src/contexts/DatabaseContext.tsx` - SQLite/IndexedDB init
- `apps/mobile/src/contexts/SyncContext.tsx` - Background sync coordinator

**Stores & hooks**:
- `apps/mobile/src/store/` - Zustand stores
- `apps/mobile/src/hooks/` - Cross-cutting hooks
- `apps/mobile/src/features/*/hooks/` - Feature-specific hooks

**Adapters**:
- `apps/mobile/src/adapters/storage/` - Platform-specific DB (SQLite/IndexedDB)
- `apps/mobile/src/adapters/secureStorage/` - Platform-specific secure storage

**Shared package**:
- `packages/shared/src/` - Shared types/constants/utils (`@recovery/shared`)

**Tests**: Co-located in `__tests__/` folders. Encryption tests: `src/utils/__tests__/encryption.test.ts`

## Reference Docs

- `SETUP.md` - Complete setup guide
- `CLAUDE.md` - Detailed development guide (1120 lines)
- `_bmad-output/reference-docs/CODING-STANDARDS.md` - Enforced patterns
- `_bmad-output/reference-docs/SYSTEM-CONTEXT.md` - Architecture deep dive
- `supabase-schema.sql` - Cloud database schema

**Supabase dashboard**: https://supabase.com/dashboard/project/tbiunmmvfbakwlzykpwq
