# Deep Dive Code Review Findings (2026-01-29)

## Critical
1) Debug localhost telemetry is executed at module import and on each render, causing unintended network calls, broken offline behavior, and potential privacy leakage in production.
   - apps/mobile/src/features/meetings/components/MeetingFilters.tsx:10
   - apps/mobile/src/features/meetings/components/MeetingFilters.tsx:58

2) Logout data wipe likely never triggers: `userIdRef` is updated before the logout effect reads it, so `previousUser` is already null and the database is not cleared. This leaves sensitive data on-device after logout.
   - apps/mobile/src/contexts/SyncContext.tsx:52-54
   - apps/mobile/src/contexts/SyncContext.tsx:212-220

3) `readingStore` does not compile: it imports `generateId` from a module that does not export it, and the file has an extra closing `}));` causing a syntax error.
   - apps/mobile/src/store/readingStore.ts:9
   - apps/mobile/src/store/readingStore.ts:111
   - apps/mobile/src/store/readingStore.ts:248-249

4) `useReadingDatabase` treats `useReadingStore()` as a store instance and calls `setState/getState` on it, which is not valid for Zustand hook return values. This breaks the reading feature at type-check/runtime.
   - apps/mobile/src/hooks/useReadingDatabase.ts:43
   - apps/mobile/src/hooks/useReadingDatabase.ts:119
   - apps/mobile/src/hooks/useReadingDatabase.ts:156
   - apps/mobile/src/hooks/useReadingDatabase.ts:290

## High
5) Web secure storage derives the master key from the Supabase access token. Access tokens rotate, so decrypting previously stored data will fail after refresh, causing silent data loss on web.
   - apps/mobile/src/contexts/AuthContext.tsx:40-41
   - apps/mobile/src/contexts/AuthContext.tsx:69-70
   - apps/mobile/src/adapters/secureStorage/web.ts:26-33
   - apps/mobile/src/adapters/secureStorage/web.ts:88-105

6) Mobile encryption uses AES-256-CBC without authentication (no AEAD/HMAC). Ciphertext is malleable, so tampering is undetectable. Sensitive recovery data should use AES-GCM or add an HMAC.
   - apps/mobile/src/utils/encryption.ts:137
   - apps/mobile/src/utils/encryption.ts:167

7) Web IndexedDB adapter defaults to loading sql.js WASM from a public CDN at runtime. This breaks offline-first guarantees and introduces a supply-chain dependency.
   - apps/mobile/src/adapters/storage/indexeddb.ts:109-110
   - apps/mobile/src/adapters/storage/indexeddb.ts:145

8) The app mixes two independent database stacks: shared stores use `recovery_companion.db`, while the app database provider uses `recovery.db`. This splits data across DBs, complicates migrations, and risks incomplete logout cleanup.
   - packages/shared/db/client.ts:38
   - apps/mobile/src/contexts/DatabaseContext.tsx:68
   - apps/mobile/src/hooks/useSobriety.ts:23

## Medium
9) IndexedDB persistence is not fully serialized. `persist()` waits on `persistQueue` but does not chain itself into the queue, so concurrent writes can interleave and overwrite newer data.
   - apps/mobile/src/adapters/storage/indexeddb.ts:225-239
   - apps/mobile/src/adapters/storage/indexeddb.ts:420-425

10) `clearDatabase` executes a large multi-statement SQL string via `execAsync`, despite earlier notes about Android sqlite instability with large multi-statement calls. If this fails mid-way, data may be partially cleared.
   - apps/mobile/src/utils/database.ts:528-540

11) Daily check-in sync explicitly skips mapping cravings to `day_rating` (because Supabase expects an integer) and instead stores encrypted cravings in `challenges_faced`. This drops the structured craving signal on the server.
   - apps/mobile/src/services/syncService.ts:426-432

## Low
12) Several features are stubbed (notifications and regular meeting store). If any UI flows route through the stub modules, functionality silently no-ops.
   - apps/mobile/src/notifications/index.ts:6-28
   - apps/mobile/src/store/regularMeetingStore.ts:75-207

13) Several IDs are generated with `Math.random()` (e.g., sync IDs, local record IDs). This is low risk but not collision-safe at scale; consider `crypto.randomUUID()`.
   - apps/mobile/src/services/syncService.ts:217
   - apps/mobile/src/services/syncService.ts:883

## Test Gaps
- No tests cover logout cleanup to verify local DBs are cleared (both stacks).
- No tests cover web secure storage key rotation (access token refresh) or IndexedDB persistence ordering.
- No tests cover reading feature end-to-end (store + DB) given current compile/runtime issues.
