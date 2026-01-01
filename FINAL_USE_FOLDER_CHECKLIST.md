# Final Checklist - Before Deleting `use` Folder ✅

## Overview
This is your **final checklist** before deleting the `use` folder. Items are organized by priority.

---

## ✅ Already Migrated (You Have These)

### Core Code (Packages/Shared)
- ✅ All constants (15 files) - step prompts, crisis resources, prayers, etc.
- ✅ Database schema and client (25+ tables)
- ✅ Encryption system (AES-256-GCM)
- ✅ 22 Zustand stores
- ✅ JITAI system
- ✅ Notifications
- ✅ Services layer
- ✅ Animations
- ✅ Type definitions

### Mobile App Code
- ✅ 15 custom hooks
- ✅ 40+ UI components (organized by feature)
- ✅ Common components (ErrorBoundary, Loading, etc.)
- ✅ Polyfills (crypto)
- ✅ Fonts
- ✅ Global CSS

### Android Configuration
- ✅ Build configuration
- ✅ Gradle properties  
- ✅ ProGuard rules
- ✅ AndroidManifest (updated with correct permissions)
- ✅ Resource files (drawables, values)

### Documentation
- ✅ All Claude docs (UX principles, coding standards, etc.)
- ✅ Original README

---

## 🎯 CRITICAL - Must Copy Before Deleting!

### 1. **Configuration Files** (Essential)

#### Babel Config - `babel.config.js`
**Why**: Configures NativeWind, polyfills, and Reanimated plugin
**What it has**: 
- NativeWind JSX import source
- Polyfills loading
- Reanimated plugin (must be last)

#### Tailwind Config - `tailwind.config.js`
**Why**: Complete design system with custom color palette
**What it has**:
- Full navy-themed color scheme
- Custom font families (Outfit, Plus Jakarta Sans, JetBrains Mono)
- Custom border radius, opacity values
- Content paths configuration

#### Metro Config - `metro.config.js`
**Why**: Required for WASM support (SQLite web) and NativeWind
**What it has**:
- WASM asset configuration
- NativeWind integration
- Global CSS input

#### Jest Config - `jest.config.js` + `jest.setup.js`
**Why**: Complete testing setup with all mocks
**What it has**:
- **jest.config.js**: Transform patterns, coverage thresholds
- **jest.setup.js**: Mocks for all Expo modules (270 lines!)
  - expo-secure-store
  - expo-crypto
  - expo-sqlite
  - expo-local-authentication
  - expo-notifications
  - expo-file-system
  - expo-sharing
  - expo-audio
  - expo-router
  - And more...

#### TypeScript Configs
- **tsconfig.json**: TypeScript compiler options
- **expo-env.d.ts**: Expo type declarations
- **nativewind-env.d.ts**: NativeWind type declarations
- **jsconfig.json**: JavaScript project config

#### EAS Build Config - `eas.json`
**Why**: Build profiles for development, preview, and production
**What it has**:
- Development profile (internal distribution)
- Preview profile (testing)
- Production profile (auto-increment, app store ready)
- Submit configuration for iOS/Android

---

### 2. **App Routes/Screens** (88 files!)

The `use/app/` folder contains **complete, working screens** for every feature:

#### Core Navigation:
- `_layout.tsx` - Main app layout
- `entry.tsx` - App entry point
- `+not-found.tsx` - 404 page
- `+html.tsx` - HTML document

#### Authentication:
- `(auth)/lock.tsx` - PIN lock screen
- `onboarding/*` - Complete onboarding flow
  - welcome, program selection, date picker, notifications

#### Tab Screens:
- `(tabs)/index.tsx` - Home screen
- `(tabs)/journal.tsx` - Journal tab
- `(tabs)/steps.tsx` - Steps tab
- `(tabs)/insights.tsx` - Insights/analytics
- `(tabs)/emergency.tsx` - Crisis resources
- `(tabs)/more.tsx` - More menu

#### Feature Screens (Complete Implementations!):
- **Journal**: `journal/new.tsx`, `[id].tsx`, `voice.tsx`
- **Meetings**: `meetings/new.tsx`, `[id].tsx`, `index.tsx`
- **Regular Meetings**: `my-meetings/*` (CRUD for recurring meetings)
- **Step Work**: `step-work/[step].tsx` + specialized screens for:
  - Step 4 (inventory)
  - Steps 8-9 (amends)
  - Step 10 (daily inventory)
  - Step 11 (meditation)
- **Achievements**: `achievements/index.tsx`, `[id].tsx`
- **Time Capsules**: `capsule/new.tsx`, `[id].tsx`
- **Vault**: `vault/new.tsx`, `[id].tsx` (motivation vault)
- **Contacts**: `contacts/add.tsx`, `index.tsx`
- **Literature**: `literature/index.tsx`
- **Prayers**: `prayers/index.tsx`
- **Promises**: `promises/index.tsx`
- **Slogans**: `slogans/index.tsx`
- **Daily Reading**: `reading/*`
- **Scenarios**: `scenarios/[id].tsx`, `history.tsx` (trigger practice)
- **Settings**: `settings/index.tsx`

#### Wellness Tools:
- `checkin.tsx` - Daily check-in
- `breathing.tsx` - Breathing exercises
- `grounding.tsx` - Grounding techniques
- `mindfulness.tsx` - Mindfulness exercises
- `coping.tsx` - Coping strategies
- `affirmations.tsx` - Daily affirmations
- `timer.tsx` - Meditation timer

#### Other:
- `relapse.tsx` - Relapse support
- `report.tsx` - Progress report
- `weekly-report.tsx` - Weekly summary
- `share-prep.tsx` - Meeting share preparation
- `sponsor-connection.tsx` - Sponsor sharing feature
- `emergency.tsx` - Emergency resources

**💡 These are production-ready screens!** You can copy them as reference or use them directly.

---

### 3. **Missing Components**

#### Capsule Component
- `use/components/capsule/CapsuleCard.tsx`

#### Literature Component
- `use/components/literature/ChapterCard.tsx`

#### Steps Component
- `use/components/steps/StepTimelineCard.tsx`

#### useClientOnlyValue utilities
- `use/components/useClientOnlyValue.ts`
- `use/components/useClientOnlyValue.web.ts`

---

### 4. **Export Functionality**

**File**: `use/lib/export/index.ts` (388 lines!)

**What it does**:
- Exports all user data to JSON
- Decrypts all encrypted content
- Shares via system share sheet
- Privacy compliance feature (GDPR)

**Functions**:
- `exportAllData()` - Complete data export
- `exportAndShare()` - Export + share dialog
- `getExportStats()` - Export statistics

**This is CRITICAL for user data portability!**

---

### 5. **Setup Documentation**

#### EAS_SETUP.md
- How to configure EAS Build
- Build profiles explained
- Submission process

#### JAVA_SETUP.md
- How to install and configure Java/JDK
- JAVA_HOME setup for Windows
- Required for Android builds

---

## 📋 Optional But Useful

### 1. **Component Tests**
- `use/components/__tests__/` - Test examples and snapshots

### 2. **Additional Types**
- `use/types/` - Extra type definitions

### 3. **Vercel Config**
- `use/vercel.json` - If you plan to deploy web version

### 4. **Setup Scripts**
- `use/setup-java.ps1` - PowerShell script for Java setup
- `use/verify-java.ps1` - Verify Java installation

---

## 🚀 Quick Copy Commands

Run these from your project root to grab everything:

### Copy Config Files:
```powershell
# Core config
Copy-Item "use\babel.config.js" -Destination "apps\mobile\babel.config.js" -Force
Copy-Item "use\tailwind.config.js" -Destination "apps\mobile\tailwind.config.js" -Force
Copy-Item "use\metro.config.js" -Destination "apps\mobile\metro.config.js" -Force

# Testing
Copy-Item "use\jest.config.js" -Destination "apps\mobile\jest.config.js" -Force
Copy-Item "use\jest.setup.js" -Destination "apps\mobile\jest.setup.js" -Force

# TypeScript
Copy-Item "use\tsconfig.json" -Destination "apps\mobile\tsconfig.json" -Force
Copy-Item "use\expo-env.d.ts" -Destination "apps\mobile\expo-env.d.ts" -Force
Copy-Item "use\nativewind-env.d.ts" -Destination "apps\mobile\nativewind-env.d.ts" -Force
Copy-Item "use\jsconfig.json" -Destination "apps\mobile\jsconfig.json" -Force

# Build
Copy-Item "use\eas.json" -Destination "apps\mobile\eas.json" -Force
```

### Copy Export Functionality:
```powershell
New-Item -ItemType Directory -Force -Path "packages\shared\export"
Copy-Item "use\lib\export\index.ts" -Destination "packages\shared\export\index.ts" -Force
```

### Copy Missing Components:
```powershell
# Capsule
New-Item -ItemType Directory -Force -Path "apps\mobile\src\components\capsule"
Copy-Item "use\components\capsule\*" -Destination "apps\mobile\src\components\capsule\" -Recurse -Force

# Literature
New-Item -ItemType Directory -Force -Path "apps\mobile\src\components\literature"
Copy-Item "use\components\literature\*" -Destination "apps\mobile\src\components\literature\" -Recurse -Force

# Steps
New-Item -ItemType Directory -Force -Path "apps\mobile\src\components\steps"
Copy-Item "use\components\steps\*" -Destination "apps\mobile\src\components\steps\" -Recurse -Force

# Client-only utilities
Copy-Item "use\components\useClientOnlyValue*.ts" -Destination "apps\mobile\src\components\" -Force
```

### Copy Documentation:
```powershell
Copy-Item "use\EAS_SETUP.md" -Destination "_bmad-output\reference-docs\EAS_SETUP.md" -Force
Copy-Item "use\JAVA_SETUP.md" -Destination "_bmad-output\reference-docs\JAVA_SETUP.md" -Force
```

### Copy All App Screens (Optional - for reference):
```powershell
New-Item -ItemType Directory -Force -Path "_bmad-output\reference-screens"
Copy-Item "use\app\*" -Destination "_bmad-output\reference-screens\" -Recurse -Force
```

---

## ⚠️ DON'T NEED / Skip These

### Already Have:
- ❌ `use/android` - You have your own Android config (updated)
- ❌ `use/node_modules` - Dependencies (reinstall with npm)
- ❌ `use/coverage` - Test coverage reports
- ❌ `use/tmp` - Temporary files
- ❌ Bug reports (.zip files)
- ❌ `use/node-v20.19.6-win-x64` - Node.js installer

### Optional/Reference:
- ⚠️ `use/package.json` - Already reviewed (use for dependency reference)
- ⚠️ `use/package-lock.json` - Lock file (not needed)

---

## ✅ Final Verification Checklist

Before deleting `use` folder, verify you have:

### Critical Files:
- [ ] `babel.config.js` (NativeWind + Reanimated config)
- [ ] `tailwind.config.js` (Design system colors)
- [ ] `metro.config.js` (WASM + NativeWind)
- [ ] `jest.config.js` + `jest.setup.js` (270 lines of mocks!)
- [ ] `eas.json` (Build profiles)
- [ ] `tsconfig.json`, `expo-env.d.ts`, `nativewind-env.d.ts`

### Important Code:
- [ ] Export functionality (`packages/shared/export/index.ts`)
- [ ] Missing components (capsule, literature, steps)
- [ ] useClientOnlyValue utilities

### Reference Material:
- [ ] App screens (88 files - optional, keep for reference)
- [ ] EAS_SETUP.md, JAVA_SETUP.md

---

## 🎯 After Copying Everything

### Test the Config:
```bash
cd apps/mobile

# Clean
rm -rf node_modules
rm -rf .expo
rm -rf android/.gradle

# Install
npm install

# Test build
npm run android
```

### If Everything Works:
```powershell
# Create a backup (just in case)
Compress-Archive -Path "use" -DestinationPath "use-backup-$(Get-Date -Format 'yyyy-MM-dd').zip"

# Then delete
Remove-Item -Recurse -Force "use"

# Also delete the backup copy if exists
Remove-Item -Recurse -Force "android copy"
```

---

## 📊 What You're Keeping

After migration, your project will have:

**From `use` folder**:
- 15,000+ lines of production code
- Complete design system
- Full testing setup  
- Production-ready screens
- Data export system
- All configuration files
- 6 months of development work!

**Value**: 💰 **Priceless**

---

## 🎉 Summary

### MUST COPY (Do This Now!):
1. ✅ Config files (babel, tailwind, metro, jest, eas, tsconfig)
2. ✅ Export functionality
3. ✅ Missing components (capsule, literature, steps)
4. ✅ Documentation (EAS_SETUP, JAVA_SETUP)

### SHOULD COPY (Highly Recommended):
5. ⚠️ App screens (88 files - keep as reference)

### CAN SKIP:
6. ❌ node_modules, coverage, tmp, bug reports

---

**Total time to copy everything**: ⏱️ **5-10 minutes**  
**Value saved**: 💎 **6+ months of work**

**Ready to delete `use` folder?** Only after you've copied the items above! ✅
