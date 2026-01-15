# Phase M: Architecture Map & Risk Register

**Date**: 2026-01-15  
**Project**: Steps to Recovery  
**Purpose**: High-level component map, dependency graph, and change guardrails

---

## 1. Architecture Map

### 1.1 Component Hierarchy (High-Level)

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile App (Expo)                       │
│  Entry: index.ts → App.tsx → Polyfills (CRITICAL FIRST)    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Provider Stack                           │
│  QueryClient → SafeArea → Theme → Database → Auth →        │
│  Sync → Notification → RootNavigator                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐      ┌──────────────┐
│  UI Layer    │    │  State Layer │      │  Data Layer  │
│              │    │              │      │              │
│ - Features   │    │ - Contexts   │      │ - Adapters   │
│ - Components │    │ - Hooks      │      │ - Services   │
│ - Navigation │    │ - Store      │      │ - Utils      │
└──────────────┘    └──────────────┘      └──────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Storage Layer                            │
│  Mobile: SQLite (expo-sqlite) | Web: IndexedDB (idb)       │
│  Adapter: src/adapters/storage/ (platform-agnostic)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloud Sync (Supabase)                    │
│  Auth: Supabase Auth | DB: Postgres 17 | RLS: Enabled      │
│  Sync: Queue-based (SyncContext + syncService)             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Module Dependency Graph

```
Polyfills (crypto, Buffer, localStorage)
    ↓
App.tsx
    ├─→ QueryClientProvider (@tanstack/react-query)
    ├─→ ThemeProvider (design-system)
    ├─→ DatabaseProvider (contexts/DatabaseContext)
    │       ├─→ StorageAdapter (adapters/storage)
    │       │       ├─→ SQLite (mobile)
    │       │       └─→ IndexedDB (web)
    │       └─→ initDatabase (utils/database)
    ├─→ AuthProvider (contexts/AuthContext)
    │       ├─→ Supabase Client (lib/supabase)
    │       └─→ SecureStore (adapters/secureStorage)
    ├─→ SyncProvider (contexts/SyncContext)
    │       ├─→ NetInfo (mobile) / navigator.onLine (web)
    │       ├─→ processSyncQueue (services/syncService)
    │       └─→ clearDatabase (utils/database)
    └─→ NotificationProvider (contexts/NotificationContext)
            └─→ expo-notifications
```

### 1.3 Data Flow (Encryption-First)

```
User Input (Journal Entry)
    ↓
encryptContent() [utils/encryption.ts]
    ↓ (AES-256-CBC + unique IV)
SQLite/IndexedDB (encrypted_body)
    ↓
addToSyncQueue() [services/syncService.ts]
    ↓
SyncContext (periodic/foreground/network trigger)
    ↓
processSyncQueue() [services/syncService.ts]
    ↓ (retry logic, exponential backoff)
Supabase.from('journal_entries').upsert()
    ↓ (RLS: auth.uid() = user_id)
Cloud Storage (still encrypted)
    ↓
decryptContent() [utils/encryption.ts]
    ↓
User Display
```

**Key Invariants**:

1. **Encryption BEFORE storage** (never store plaintext)
2. **Keys ONLY in SecureStore** (never AsyncStorage/SQLite)
3. **Deletes BEFORE inserts** (sync queue order)
4. **SQLite is source of truth** (Supabase is backup)

### 1.4 Critical Paths (Security-Sensitive)

| Path | Files | Risk Level |
|------|-------|------------|
| **Encryption** | `utils/encryption.ts`, `adapters/secureStorage/` | 🔴 CRITICAL |
| **Auth** | `contexts/AuthContext.tsx`, `lib/supabase.ts` | 🔴 CRITICAL |
| **Sync** | `services/syncService.ts`, `contexts/SyncContext.tsx` | 🔴 CRITICAL |
| **Database** | `utils/database.ts`, `adapters/storage/` | 🟠 HIGH |
| **Logout** | `utils/logoutCleanup.ts` | 🟠 HIGH |

---

## 2. Dependency Graph Highlights

### 2.1 Critical Libraries

| Library | Version | Purpose | Risk |
|---------|---------|---------|------|
| **expo** | 54.0.0 | Platform framework | 🟠 Breaking changes in SDK upgrades |
| **react-native** | 0.81.5 | UI framework | 🟠 Native module compatibility |
| **expo-sqlite** | 16.0.10 | Mobile storage | 🔴 Data loss if broken |
| **@supabase/supabase-js** | 2.89.0 | Cloud sync | 🟠 Auth/RLS changes |
| **crypto-js** | 4.2.0 | Encryption | 🔴 Security if vulnerable |
| **@tanstack/react-query** | 5.90.15 | State management | 🟢 Low risk |

### 2.2 Risky Integrations

1. **Expo SDK 54 + React Native 0.81.5**
   - **Risk**: New Architecture (newArchEnabled: true) may have compatibility issues
   - **Mitigation**: Test on real devices, monitor Expo forums

2. **expo-sqlite (mobile) + idb (web)**
   - **Risk**: Schema drift between platforms
   - **Mitigation**: Shared StorageAdapter interface, integration tests

3. **Supabase RLS + Client-Side Encryption**
   - **Risk**: RLS bypass or encryption key leakage
   - **Mitigation**: Security audits, never log keys

---

## 3. Fragile Surfaces (High-Risk Areas)

### 3.1 Native Builds (Android/iOS)

**Why Fragile**:

- Gradle/CocoaPods version conflicts
- Native module linking (expo-sqlite, expo-secure-store, expo-notifications)
- Hermes bytecode compilation
- New Architecture (Fabric/TurboModules)

**Guardrails**:

- ✅ Run `npm run android` on emulator before merging native changes
- ✅ Test on physical device (not just emulator)
- ✅ Check `npx expo-doctor` for config issues
- ✅ Verify `expo prebuild` generates correct native code

**Rollback**:

- Revert `app.json`, `build.gradle`, `Podfile` changes
- Run `npx expo prebuild --clean` to regenerate native folders

### 3.2 Database Migrations

**Why Fragile**:

- Schema changes can break existing data
- Migration rollback is complex (no built-in down migrations)
- Supabase + SQLite schema drift

**Guardrails**:

- ✅ Increment `CURRENT_SCHEMA_VERSION` in `utils/database.ts`
- ✅ Use `columnExists()` checks before `ALTER TABLE`
- ✅ Test migration on fresh install AND existing data
- ✅ Backup local database before migration (if possible)
- ✅ Run `supabase db diff` to detect cloud schema drift

**Rollback**:

- Decrement `CURRENT_SCHEMA_VERSION`
- Remove migration code from `runMigrations()`
- Clear `schema_migrations` table entry (manual SQL)

### 3.3 Auth Flow

**Why Fragile**:

- Session token expiry (JWT 1 hour)
- Refresh token rotation
- Encryption key tied to session
- Logout cleanup (database + keys)

**Guardrails**:

- ✅ Test login → logout → login cycle
- ✅ Verify `logoutCleanup()` deletes encryption keys
- ✅ Test session expiry handling
- ✅ Check RLS policies in Supabase dashboard

**Rollback**:

- Clear AsyncStorage + SecureStore manually
- Reset Supabase session via `supabase.auth.signOut()`

### 3.4 Sync Queue

**Why Fragile**:

- Network timeouts (30s limit)
- Retry logic complexity (exponential backoff)
- Delete-before-insert ordering
- Supabase schema mapping (local ≠ cloud)

**Guardrails**:

- ✅ Test offline → online sync
- ✅ Simulate network interruption (airplane mode)
- ✅ Verify delete operations don't orphan FK references
- ✅ Check `sync_queue` table for failed items (retry_count >= 3)

**Rollback**:

- Clear `sync_queue` table (manual SQL)
- Re-queue failed items with `addToSyncQueue()`

---

## 4. Risk Register (Detailed)

### 4.1 Data Loss Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Encryption key loss** | LOW | 🔴 CRITICAL | Backup to cloud (future), warn user on logout |
| **SQLite corruption** | LOW | 🔴 CRITICAL | WAL mode, integrity checks, cloud backup |
| **Sync queue failure** | MEDIUM | 🟠 HIGH | Retry logic, manual sync trigger |
| **Migration failure** | LOW | 🟠 HIGH | Idempotent migrations, version checks |

### 4.2 Security Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **RLS bypass** | LOW | 🔴 CRITICAL | Audit policies, test with multiple users |
| **Key leakage (logs)** | MEDIUM | 🔴 CRITICAL | Use `logger` (auto-sanitizes), never console.log |
| **Plaintext storage** | LOW | 🔴 CRITICAL | Code review, grep for `AsyncStorage` |
| **Session hijacking** | LOW | 🟠 HIGH | HTTPS only, short JWT expiry (1h) |

### 4.3 Build/Deployment Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Android build failure** | MEDIUM | 🟠 HIGH | Test on emulator, CI/CD builds |
| **iOS build failure** | MEDIUM | 🟠 HIGH | Test on simulator, EAS build |
| **Web bundle size** | LOW | 🟢 LOW | Code splitting, tree shaking |
| **Hermes crash** | LOW | 🟠 HIGH | Test on device, monitor Sentry |

---

## 5. Guardrails (Change-Type Specific)

### 5.1 Encryption/Auth Changes

**Pre-Change**:

- [ ] Review `CLAUDE.md` security section
- [ ] Invoke `security-auditor` agent (if available)
- [ ] Grep for `console.log` in changed files

**Post-Change**:

- [ ] Run `npm run test:encryption` (must pass)
- [ ] Test login → encrypt → decrypt → logout cycle
- [ ] Verify keys stored in SecureStore (not AsyncStorage)
- [ ] Check logs for sensitive data leakage

**Rollback**:

- Revert code changes
- Clear SecureStore: `await secureStorage.deleteItemAsync('journal_encryption_key')`

### 5.2 Database/Migration Changes

**Pre-Change**:

- [ ] Increment `CURRENT_SCHEMA_VERSION`
- [ ] Add migration to `runMigrations()` with version check
- [ ] Use `columnExists()` for ALTER TABLE

**Post-Change**:

- [ ] Test on fresh install (no existing data)
- [ ] Test on existing data (upgrade path)
- [ ] Run `supabase db diff` to check cloud schema
- [ ] Verify indexes created correctly

**Rollback**:

- Decrement `CURRENT_SCHEMA_VERSION`
- Remove migration code
- Clear `schema_migrations` entry (manual SQL)

### 5.3 Sync/Network Changes

**Pre-Change**:

- [ ] Review sync queue order (deletes first)
- [ ] Check timeout values (30s default)
- [ ] Verify retry logic (max 3 attempts)

**Post-Change**:

- [ ] Test offline mode (airplane mode)
- [ ] Test network interruption (mid-sync)
- [ ] Verify exponential backoff delays
- [ ] Check `sync_queue` for failed items

**Rollback**:

- Revert code changes
- Clear `sync_queue` table
- Trigger manual sync

### 5.4 Native Module Changes

**Pre-Change**:

- [ ] Check Expo SDK compatibility
- [ ] Review native module docs (expo.dev)
- [ ] Backup `app.json`, `build.gradle`, `Podfile`

**Post-Change**:

- [ ] Run `npx expo-doctor`
- [ ] Run `npx expo prebuild --clean`
- [ ] Test on Android emulator
- [ ] Test on iOS simulator (if macOS)
- [ ] Test on physical device

**Rollback**:

- Revert config files
- Run `npx expo prebuild --clean`
- Reinstall dependencies

---

## 6. Testing Requirements (Per Change Type)

| Change Type | Required Tests | Optional Tests |
|-------------|----------------|----------------|
| **Encryption** | `npm run test:encryption` | Manual encrypt/decrypt |
| **Auth** | Login/logout cycle | Session expiry, refresh |
| **Sync** | Offline sync test | Network interruption |
| **Database** | Fresh install + upgrade | Migration rollback |
| **UI** | Accessibility validator | Screen reader test |
| **Native** | Android emulator run | Physical device test |

---

## 7. Rollback Strategies (Quick Reference)

| Component | Rollback Method | Data Loss Risk |
|-----------|-----------------|----------------|
| **Code** | `git revert <commit>` | None |
| **Database** | Decrement schema version | Possible (if migration destructive) |
| **Encryption** | Clear SecureStore | 🔴 HIGH (data inaccessible) |
| **Sync Queue** | Clear `sync_queue` table | 🟠 MEDIUM (re-sync needed) |
| **Native Build** | `expo prebuild --clean` | None |

---

## 8. Monitoring & Observability

### 8.1 Key Metrics to Track

- **Sync Queue Length**: `SELECT COUNT(*) FROM sync_queue WHERE retry_count < 3`
- **Failed Syncs**: `SELECT COUNT(*) FROM sync_queue WHERE failed_at IS NOT NULL`
- **Encryption Key Presence**: `await hasEncryptionKey()`
- **Database Version**: `SELECT MAX(version) FROM schema_migrations`

### 8.2 Error Logging

**Current**:

- `utils/logger.ts` (auto-sanitizes sensitive data in production)
- Sentry integration (`@sentry/react-native` 7.8.0)

**Gaps**:

- No centralized error dashboard
- No sync failure alerts

---

**Phase M Complete**: Architecture map and guardrails defined  
**Next Phase**: A (Act) - Implement prioritized fixes  
**Ready for**: Code changes with verification
