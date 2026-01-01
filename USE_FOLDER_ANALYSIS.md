# Use Folder Analysis - Valuable Resources for Migration

## Overview
The `use` folder contains a **complete, production-ready 12-Step Recovery Companion app** with extensive features, components, and infrastructure. This is a goldmine of working code that should be migrated to your current monorepo structure.

---

## 🎯 High Priority - Critical Features

### 1. **Core Constants & Content** (`use/lib/constants/`)
These are essential recovery program content that your app needs:

- ✅ **stepPrompts.ts** - Complete 12-step work prompts with questions for each step
- ✅ **crisisResources.ts** - Crisis hotlines for 6 regions (US, UK, CA, AU, NZ, IE) + coping strategies
- ✅ **dailyReadings.ts** - Daily meditation readings
- ✅ **prayers.ts** - Common recovery prayers
- ✅ **promises.ts** - The 12 Promises from AA
- ✅ **slogans.ts** - Recovery slogans and sayings
- ✅ **achievements.ts** - Gamification achievements system
- ✅ **milestones.ts** - Sobriety milestone definitions
- ✅ **keytags.ts** - Virtual keytag rewards
- ✅ **meetingTopics.ts** - Meeting discussion topics
- ✅ **triggerScenarios.ts** - Interactive trigger practice scenarios
- ✅ **emotions.ts** - Emotion tracking options
- ✅ **readings.ts** - Literature chapters and content

**Action**: Copy entire `use/lib/constants/` to `packages/shared/constants/`

### 2. **Database Schema** (`use/lib/db/client.ts`)
Complete SQLite database with 25+ tables including:
- Sobriety tracking
- Journal entries (encrypted)
- Daily check-ins
- Meeting logs
- Step work (4th, 8th, 9th, 10th steps)
- Achievements & milestones
- Time capsules
- Contacts & phone logs
- Literature progress
- And much more...

**Features**:
- Migration system with version tracking
- Performance indexes
- WAL mode enabled
- Foreign key constraints
- Field-level encryption for sensitive data

**Action**: Adapt schema for your current database setup

### 3. **Encryption System** (`use/lib/encryption/index.ts`)
Production-grade AES-256-GCM encryption with:
- Biometric-protected key storage
- Automatic legacy XOR migration
- Field-level encryption for sensitive content
- Web Crypto API with polyfills

**Action**: Copy to `packages/shared/utils/encryption/`

---

## 📦 Medium Priority - Feature Components

### 4. **Zustand Stores** (`use/lib/store/`)
22 well-organized state management stores:
- `authStore.ts` - Authentication & PIN
- `achievementStore.ts` - Achievement tracking
- `journalStore.ts` - Journal entries
- `meetingStore.ts` - Meeting logs
- `stepWorkStore.ts` - Step progress
- `contactStore.ts` - Recovery contacts
- `settingsStore.ts` - App settings
- `capsuleStore.ts` - Time capsules
- `vaultStore.ts` - Motivation vault
- And 13 more...

**Action**: Adapt stores to your state management approach

### 5. **Custom Hooks** (`use/lib/hooks/`)
15 specialized hooks including:
- `useAchievements.ts`
- `useAudioRecorder.ts`
- `useAuth.ts`
- `useCheckin.ts`
- `useContacts.ts`
- `useJitai.ts` - Just-in-Time Adaptive Interventions
- `useJournal.ts`
- `useMeetings.ts`
- `useNotifications.ts`
- `usePinEntry.ts`
- `useSobriety.ts`
- And more...

**Action**: Copy to `apps/mobile/src/hooks/`

### 6. **UI Components** (`use/components/`)
Complete component library organized by feature:

#### Common Components:
- `CrisisButton.tsx` - Emergency resources
- `EmptyState.tsx`
- `ErrorBoundary.tsx`
- `LoadingState.tsx`
- `PromptModal.tsx` - Cross-platform input
- `SponsorWidget.tsx`

#### Feature Components:
- **Achievements**: AchievementCard, KeytagModal, KeytagWall
- **Auth**: PinIndicators, PinKeypad
- **Capsule**: CapsuleCard (time capsules)
- **Contacts**: ContactCard, QuickCall
- **Home**: DailyReadingCard, StatsRow, PhoneWidget, UpcomingMeetingWidget
- **Journal**: ReflectionCard
- **Literature**: ChapterCard
- **Meetings**: MeetingCard, SharePrepCard
- **Progress**: SobrietyCounter, MilestoneCard, SimpleTrendChart
- **Step Work**: InventoryEntryCard, AmendsCard, ReviewCard
- **Steps**: StepTimelineCard

**Action**: Selectively migrate components as needed to `apps/mobile/src/components/`

---

## 🔧 Medium-Low Priority - Infrastructure

### 7. **Services** (`use/lib/services/`)
- `achievementTriggers.ts` - Auto-unlock achievements
- `errorTracking.ts` - Sentry integration
- `sponsorConnection.ts` - Sponsor sharing/encoding
- `weeklyReport.ts` - Weekly progress reports

**Action**: Adapt for your services layer

### 8. **JITAI System** (`use/lib/jitai/`)
Just-in-Time Adaptive Interventions:
- Smart notification timing based on user patterns
- Trigger detection
- Contextual support delivery

**Action**: Consider for Phase 2+ features

### 9. **Notification System** (`use/lib/notifications/`)
- Meeting reminders
- Daily check-in reminders
- JITAI notifications

**Action**: Integrate with your notification strategy

---

## 📱 App Structure & Routes

### 10. **App Routes** (`use/app/`)
88 `.tsx` files organized by feature using Expo Router:
- Complete navigation structure
- All screens implemented
- Tab-based navigation
- Modal routes

**Action**: Review for navigation patterns and screen structure

---

## 📝 Documentation & Assets

### 11. **Claude Documentation** (`use/md/claude/`)
Valuable development docs:
- `UX-PRINCIPLES.md` - UX guidelines
- `SYSTEM-CONTEXT.md` - System architecture
- `CODING-STANDARDS.md` - Code standards
- `PERFORMANCE.md` - Performance optimization
- `PRIVACY_POLICY.md` - Privacy policy template
- `APP_STORE_ASSETS.md` - Store listing info
- `SENTRY-SETUP.md` - Error tracking setup
- `PHASE-PROMPTS.md` - Development phases

**Action**: Review and adapt for current project docs

### 12. **Assets** (`use/assets/`)
- Custom fonts (TTF files)
- App icons and images (PNG)
- Splash screens

**Action**: Copy to `apps/mobile/assets/`

---

## 📄 Configuration Files

### 13. **Important Config Files**
- ✅ `app.json` - Complete Expo configuration with:
  - iOS/Android permissions
  - Privacy manifests
  - Plugin configurations
  - EAS setup
- ✅ `eas.json` - EAS Build configuration
- ✅ `babel.config.js` - Babel setup
- ✅ `tailwind.config.js` - Tailwind configuration
- ✅ `metro.config.js` - Metro bundler config
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `jest.config.js` - Testing configuration
- ✅ `polyfills.ts/cjs` - Crypto polyfills for web/native

**Action**: Compare and merge relevant configs

---

## 📊 Dependencies to Consider

### Key Dependencies from `use/package.json`:

**UI/Animation**:
- `lucide-react-native` - Icon library
- `react-native-confetti-cannon` - Celebration animations
- `react-native-reanimated` - Smooth animations
- `nativewind` - Tailwind for React Native

**Functionality**:
- `expo-audio` - Voice journal entries
- `expo-haptics` - Tactile feedback
- `expo-local-authentication` - Biometric auth
- `expo-secure-store` - Encrypted key storage
- `expo-notifications` - Push notifications
- `expo-sqlite` - Local database
- `expo-standard-web-crypto` - Crypto polyfills
- `@tanstack/react-query` - Data fetching/caching

**Testing**:
- `@testing-library/react-native`
- `jest-expo`

**Action**: Audit current dependencies and add missing ones

---

## 🎯 Recommended Migration Priority

### Phase 1: Core Content (Do First)
1. Copy all constants from `use/lib/constants/` → `packages/shared/constants/`
2. Copy encryption system `use/lib/encryption/` → `packages/shared/utils/encryption/`
3. Copy database schema and adapt for your setup

### Phase 2: Essential Features
4. Migrate Zustand stores (or adapt to your state management)
5. Copy custom hooks to `apps/mobile/src/hooks/`
6. Copy common UI components (ErrorBoundary, LoadingState, etc.)

### Phase 3: Feature Components
7. Selectively migrate feature components as you build screens
8. Copy assets (fonts, images)
9. Merge configuration files

### Phase 4: Advanced Features
10. JITAI system
11. Notification system
12. Services layer
13. Achievement triggers

---

## 💡 Key Insights

### What Makes This Valuable:
1. **Production-Ready**: This isn't prototype code - it's battle-tested
2. **Security-First**: AES-256-GCM encryption, biometric auth, secure storage
3. **Offline-First**: Complete SQLite setup with migrations
4. **Privacy-Focused**: No external data collection, everything local
5. **Recovery-Specific**: All the 12-step content and workflows are already implemented
6. **Comprehensive**: 25+ database tables, 22 stores, 15+ hooks, 40+ components

### Architecture Highlights:
- **Defense in Depth**: Multiple layers of security
- **Migration System**: Versioned database migrations
- **Polyfills**: Cross-platform crypto support (web + native)
- **Testing**: Jest setup with React Native Testing Library
- **Error Tracking**: Sentry integration ready
- **Performance**: WAL mode, indexes, optimized queries

---

## ⚠️ Important Notes

1. **Don't Delete Yet**: Keep the `use` folder until migration is complete
2. **Test Encryption**: The encryption system is critical - test thoroughly
3. **Database Migrations**: Adapt the migration system to your current schema
4. **Dependencies**: Some packages might conflict - audit carefully
5. **Expo SDK**: Both are on Expo 54, so compatibility should be good

---

## 🚀 Quick Wins

Start with these high-value, low-effort migrations:

1. **Crisis Resources** - Copy `crisisResources.ts` immediately (lifesaving feature)
2. **Step Prompts** - Copy `stepPrompts.ts` (core program content)
3. **Prayers & Promises** - Copy `prayers.ts` and `promises.ts`
4. **Encryption** - Copy encryption system (needed for privacy)
5. **Common Components** - Copy ErrorBoundary, LoadingState, EmptyState

---

## Summary

The `use` folder contains **a complete, working recovery app** that's more advanced than your current setup. Instead of building from scratch, you should:

1. **Migrate the core constants** (step prompts, crisis resources, etc.)
2. **Adopt the encryption system** (production-grade security)
3. **Use the database schema as reference** (comprehensive data model)
4. **Selectively copy components** as you build features
5. **Keep it as reference** for implementation patterns

This is essentially a treasure trove of production-ready code that will save you months of development time. 🎉
