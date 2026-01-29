# Most Relevant Documentation for Steps-to-Recovery Project

## Overview
This document provides the most relevant documentation for your React Native/Expo recovery app stack. Based on your codebase analysis, this covers the 5 core technologies you're using.

---

## 1. EXPO SDK 54 (Framework & Platform)
**Status**: High reputation | 8,646 code snippets | Benchmark: 63.4

### Key Commands
```bash
# Start development
npx expo start

# Run on platforms
npx expo run:android
npx expo run:ios
npx expo start --web

# Build with EAS
npx eas-cli@latest init
eas deploy
```

### Why It Matters for Your App
- Powers cross-platform builds (iOS, Android, Web)
- Provides native module integrations (encryption, notifications, secure storage)
- EAS builds handle app signing and certificates
- Live updates allow OTA deployment

### Key Expo Modules Used in Your Stack
- `expo-sqlite` - Local database (alternative: sql.js for web)
- `expo-secure-store` - Secure key storage (Keychain/Keystore)
- `expo-notifications` - Push notifications
- `expo-crypto` - Cryptographic operations
- `expo-router` - File-based routing (v6)
- `expo-updates` - Over-the-air updates

---

## 2. SUPABASE JS CLIENT (Backend/Database)
**Status**: High reputation | 491 code snippets | Benchmark: 90.3

### Initialize Client
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tbiunmmvfbakwlzykpwq.supabase.co',
  'your-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    db: { schema: 'public' },
  }
)
```

### Critical Authentication Patterns
```javascript
// Sign up
const { data, error } = await auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: { full_name: 'John Doe' },
    emailRedirectTo: 'https://example.com/auth/callback'
  }
})

// Sign in
const { data: signInData, error: signInError } = await auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Listen to auth changes
const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event)
  if (session) {
    console.log('User ID:', session.user.id)
  }
})
```

### Database Operations (with Row-Level Security)
```javascript
// For your journal entries (encrypted_body stored)
const { data, error } = await supabase
  .from('journal_entries')
  .select('*')
  .eq('user_id', session.user.id)

// Insert with sync tracking
const { data, error } = await supabase
  .from('journal_entries')
  .upsert({
    supabase_id: uuid(),  // For idempotent syncs
    user_id: session.user.id,
    encrypted_body: encryptedContent,
    created_at: new Date(),
    is_synced: true
  })
```

### Schema Mapping Reminder
| Local SQLite | Supabase | Notes |
|---|---|---|
| `encrypted_body` | `content` | Journal entries |
| `encrypted_answer` + `question_number` | `content` | Step work |
| `is_complete` (INTEGER 0/1) | `is_completed` (BOOLEAN) | Step work |
| `check_in_type` | `checkin_type` | Daily check-ins |
| `encrypted_tags` (JSON string) | `tags` (TEXT[]) | Array in Supabase |

**Project ID**: `tbiunmmvfbakwlzykpwq`

---

## 3. REACT QUERY (TanStack Query v5.90)
**Status**: High reputation | 1,664 code snippets | Benchmark: 84.4

### Why Use React Query in Your App
- **Server state management** - Keep SQLite/Supabase data in sync
- **Automatic caching** - Avoid redundant queries
- **Background refetching** - Stay up-to-date without user action
- **Offline support** - Query cache survives network outages

### Key Query Pattern for Your App
```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Query for journal entries
const useJournalEntries = () => {
  return useQuery({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,     // 10 minutes (formerly cacheTime)
  })
}

// Usage in component
function JournalList() {
  const { data: entries, isLoading, error } = useJournalEntries()
  
  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>
  
  return entries.map(entry => <JournalItem key={entry.id} entry={entry} />)
}
```

### Key Mutation Pattern for Your App
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Mutation for adding journal entry
const useAddJournalEntry = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (entry: JournalEntry) => {
      const encrypted = await encryptContent(entry.body)
      
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          supabase_id: v4(),
          encrypted_body: encrypted,
          created_at: new Date(),
        })
      
      if (error) throw error
      return data
    },
    onMutate: async (newEntry) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['journal-entries'] })
      
      const previousEntries = queryClient.getQueryData(['journal-entries'])
      
      queryClient.setQueryData(['journal-entries'], (old: any) => [
        newEntry,
        ...old,
      ])
      
      return { previousEntries }
    },
    onError: (error, newEntry, context) => {
      // Rollback on error
      queryClient.setQueryData(['journal-entries'], context?.previousEntries)
    },
    onSuccess: () => {
      // Invalidate to refetch from server
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] })
    },
  })
}
```

### Query Keys Pattern
```typescript
// Standardized query key factory
export const journalKeys = {
  all: ['journal'] as const,
  lists: () => [...journalKeys.all, 'list'] as const,
  list: (filters: string) => [...journalKeys.lists(), { filters }] as const,
  details: () => [...journalKeys.all, 'detail'] as const,
  detail: (id: string) => [...journalKeys.details(), id] as const,
}

// Usage
queryClient.invalidateQueries({ queryKey: journalKeys.lists() })
```

---

## 4. ZUSTAND (State Management)
**Status**: High reputation | 498 code snippets | Benchmark: 68.3

### Why Zustand for Your App
- **Minimal boilerplate** - No Redux actions/reducers
- **Type-safe** - Full TypeScript support
- **Client state only** - UI state, settings, preferences
- **Hooks-based** - Use like useState

### Basic Store Pattern
```typescript
import { create } from 'zustand'

interface SettingsStore {
  theme: 'light' | 'dark'
  notificationsEnabled: boolean
  setTheme: (theme: 'light' | 'dark') => void
  toggleNotifications: () => void
}

export const useSettingsStore = create<SettingsStore>()((set) => ({
  theme: 'light',
  notificationsEnabled: true,
  setTheme: (theme) => set({ theme }),
  toggleNotifications: () => set((state) => ({
    notificationsEnabled: !state.notificationsEnabled,
  })),
}))

// Usage in component
function SettingsScreen() {
  const { theme, setTheme } = useSettingsStore()
  
  return (
    <Pressable onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      <Text>Theme: {theme}</Text>
    </Pressable>
  )
}
```

### Store with Context (Scoped Stores)
```typescript
import { createContext, useContext, ReactNode, useState } from 'react'
import { createStore, useStore } from 'zustand'

interface SessionStore {
  sessionId: string
  setSessionId: (id: string) => void
}

const SessionContext = createContext<ReturnType<typeof createSessionStore> | null>(null)

const createSessionStore = () => createStore<SessionStore>()((set) => ({
  sessionId: '',
  setSessionId: (id) => set({ sessionId: id }),
}))

function SessionProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createSessionStore())
  return (
    <SessionContext.Provider value={store}>
      {children}
    </SessionContext.Provider>
  )
}

// Custom hook to use scoped store
function useSessionStore<T>(selector: (state: SessionStore) => T) {
  const store = useContext(SessionContext)
  if (!store) throw new Error('Missing SessionProvider')
  return useStore(store, selector)
}

// Usage
function SessionDisplay() {
  const sessionId = useSessionStore((state) => state.sessionId)
  return <Text>Session: {sessionId}</Text>
}
```

### Optimization with useShallow
```typescript
import { useShallow } from 'zustand/react/shallow'

// Prevent unnecessary re-renders
function StoreConsumer() {
  const { nuts, honey } = useSettingsStore(
    useShallow((state) => ({ nuts: state.nuts, honey: state.honey }))
  )
  
  return <Text>Nuts: {nuts}, Honey: {honey}</Text>
}
```

### IMPORTANT: What NOT to Use Zustand For
❌ **Server state** (use React Query instead)
- Journal entries from Supabase
- Step work data
- User profile from auth
- Daily check-ins

✅ **DO Use Zustand For**
- Theme preference (light/dark)
- UI state (modals open/closed)
- App settings
- User preferences

---

## 5. EXPO ROUTER v6 (File-Based Routing)
**Status**: Part of Expo | Multiple code examples

### Basic Navigation Setup
```typescript
// app/_layout.tsx (Root layout)
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="journal/[id]"
        options={{ title: 'Journal Entry' }}
      />
    </Stack>
  )
}
```

### Navigation Methods
```typescript
import { Link, useRouter } from 'expo-router'

export default function HomeScreen() {
  const router = useRouter()
  
  return (
    <View>
      {/* Declarative Link */}
      <Link href="/journal/123">View Entry</Link>
      
      {/* Programmatic navigation */}
      <Pressable onPress={() => router.push('/journal/new')}>
        <Text>New Entry</Text>
      </Pressable>
      
      {/* Navigate back */}
      <Pressable onPress={() => router.back()}>
        <Text>Go Back</Text>
      </Pressable>
      
      {/* Replace (don't add to history) */}
      <Pressable onPress={() => router.replace('/(auth)/login')}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  )
}
```

### Dynamic Routes with Parameters
```typescript
// app/journal/[id].tsx
import { useLocalSearchParams } from 'expo-router'

export default function JournalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  
  return <JournalEntryView entryId={id!} />
}

// Navigate to it
<Link href={`/journal/${entryId}`}>View Entry</Link>

// Or with params object
<Link
  href={{
    pathname: '/journal/[id]',
    params: { id: '123' }
  }}
>
  View Entry
</Link>
```

### Error Handling
```typescript
// app/+not-found.tsx
import { Link } from 'expo-router'

export default function NotFound() {
  return (
    <View>
      <Text>This screen doesn't exist.</Text>
      <Link href="/">Go to home screen</Link>
    </View>
  )
}
```

### Deep Linking Configuration
```typescript
// Configure initial route for back navigation
export const unstable_settings = {
  initialRouteName: 'index',
}

// This ensures users can navigate back from deep-linked pages
```

---

## Architecture Overview for Your App

```
User Input
    ↓
[Component Layer]
  • React components (NativeWind styled)
  • Use React Query hooks for data
  • Use Zustand for UI state
    ↓
[Data Layer]
  • React Query caches server state
  • Zustand stores client state
    ↓
[Storage Layer]
  • SQLite (Local) ← Source of truth
  • Supabase (Cloud) ← Backup/Sync
    ↓
[Security Layer]
  • Encryption: encrypt-before-store
  • Keys: SecureStore only (never AsyncStorage)
  • Row-level security on Supabase
```

---

## Critical Patterns for Your Recovery App

### 1. Encryption Flow
```typescript
// ALWAYS encrypt before storage
const encryptedContent = await encryptContent(userInput)
await db.runAsync(
  'INSERT INTO journal_entries (encrypted_body) VALUES (?)',
  [encryptedContent]
)
```

### 2. Sync Queue Pattern
```typescript
// Add to queue
await syncQueue.push({
  type: 'insert',
  table: 'journal_entries',
  data: { supabase_id: uuid(), encrypted_body, ... }
})

// Process queue
await processSyncQueue()
```

### 3. Database Migration Pattern
```typescript
// In database.ts, increment version
const CURRENT_SCHEMA_VERSION = 5

// Add migration
if (!columnExists('journal_entries', 'new_column')) {
  await db.execAsync(
    'ALTER TABLE journal_entries ADD COLUMN new_column TEXT'
  )
}
```

### 4. Query + Mutation Integration
```typescript
// Query fetches from DB
const { data } = useQuery({
  queryKey: ['journal-entries'],
  queryFn: () => db.getJournalEntries()
})

// Mutation updates DB and cache
const { mutate } = useMutation({
  mutationFn: addJournalEntry,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['journal-entries'] })
  }
})
```

---

## Key References in Your Codebase

### Files to Review
- [CLAUDE.md](CLAUDE.md) - Detailed 1120-line dev guide
- [SETUP.md](SETUP.md) - Complete setup instructions
- [supabase-schema.sql](supabase-schema.sql) - Cloud schema
- [apps/mobile/src/utils/database.ts](apps/mobile/src/utils/database.ts) - Local DB
- [apps/mobile/src/services/syncService.ts](apps/mobile/src/services/syncService.ts) - Sync logic
- [apps/mobile/src/utils/encryption.ts](apps/mobile/src/utils/encryption.ts) - Crypto

### Configuration
- **Supabase Project**: `tbiunmmvfbakwlzykpwq`
- **Expo SDK**: 54
- **TypeScript**: Strict mode
- **Database Adapter**: Platform-specific (SQLite/IndexedDB)
- **Secure Storage**: Keychain (iOS) / Keystore (Android) / Encrypted local (Web)

---

## Testing Checklist

Before committing changes:
- [ ] Run `npm run test:encryption` after any crypto changes
- [ ] Run `npm run type-check` for TypeScript validation
- [ ] Verify database migration on both fresh install AND existing data
- [ ] Test on both Android and iOS (or web)
- [ ] Verify RLS policies updated in Supabase
- [ ] No plaintext data logged to console
- [ ] All encryption keys from SecureStore only

---

## Running the App

```bash
# Development
npm run mobile              # Start Expo dev server
npm run android            # Run on Android
npm run ios                # Run on iOS (macOS only)
npm run web                # Run on web

# Testing
npm run test               # All tests
npm run test:encryption    # Encryption tests (CRITICAL)
npm run type-check         # TypeScript check

# Building
npm run build              # Production build
```

---

## Quick Reference: Your Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Expo | ~54.0.0 | Cross-platform native |
| UI Framework | React Native | ^0.81.5 | Native components |
| Language | TypeScript | ~5.9.3 | Type safety (strict) |
| Routing | Expo Router | ~6.0.21 | File-based routing |
| Styling | NativeWind | ^4.2.1 | Tailwind CSS |
| State (Server) | React Query | ^5.90.15 | Server state sync |
| State (Client) | Zustand | ^5.0.9 | Client state |
| Backend | Supabase | ^2.89.0 | Auth + Database |
| Local Storage | SQLite / IndexedDB | Native | Offline-first DB |
| Secure Storage | Expo Secure Store | ~15.0.8 | Encryption keys |
| Monorepo | Turborepo | ^2.7.3 | Build orchestration |

---

## Resources

- **Expo Docs**: https://docs.expo.dev
- **Supabase Docs**: https://supabase.com/docs
- **React Query**: https://tanstack.com/query/v5
- **Zustand**: https://github.com/pmndrs/zustand
- **React Native**: https://reactnative.dev
- **TypeScript**: https://www.typescriptlang.org

---

Generated: January 29, 2026
