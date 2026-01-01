# Quick Start Checklist ✅

## Immediate Actions (Do These First!)

### 1. ✅ Update Mobile App Dependencies

Add these to `apps/mobile/package.json` dependencies:

```bash
cd apps/mobile
npm install expo-audio expo-blur expo-clipboard expo-haptics expo-linear-gradient expo-linking expo-local-authentication expo-router expo-sharing expo-sms expo-splash-screen expo-standard-web-crypto expo-updates expo-web-browser lucide-react-native nativewind react-native-confetti-cannon react-native-get-random-values react-native-reanimated react-native-svg react-native-worklets tailwindcss base-64 uuid
```

### 2. ✅ Create Shared Package Configuration

Create `packages/shared/package.json`:

```json
{
  "name": "@recovery/shared",
  "version": "1.0.0",
  "main": "index.ts",
  "types": "index.ts",
  "private": true,
  "dependencies": {
    "expo-crypto": "^15.0.8",
    "expo-secure-store": "^15.0.8",
    "expo-sqlite": "^16.0.10",
    "expo-standard-web-crypto": "^3.0.6",
    "zustand": "^5.0.9"
  }
}
```

Then run:
```bash
cd packages/shared
npm install
```

### 3. ✅ Create Shared Package Index

Create `packages/shared/index.ts`:

```typescript
// Core exports
export * from './constants';
export * from './types';
export * from './store';
export * from './db';
export * from './utils';
export * from './services';
export * from './jitai';
export * from './notifications';
export * from './animations';
```

### 4. ✅ Configure TypeScript Paths

Update `apps/mobile/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "paths": {
      "@recovery/shared": ["../../packages/shared"],
      "@recovery/shared/*": ["../../packages/shared/*"]
    }
  }
}
```

### 5. ✅ Import Polyfills (CRITICAL!)

At the TOP of `apps/mobile/App.tsx` or your entry file:

```typescript
import './polyfills'; // MUST BE FIRST!

// ... rest of imports
```

### 6. ✅ Configure Tailwind

Create `apps/mobile/tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 7. ✅ Update Babel Config

Create/update `apps/mobile/babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
```

### 8. ✅ Initialize App

In your `App.tsx`:

```typescript
import './polyfills';
import { useEffect } from 'react';
import { initializeEncryptionKey } from '@recovery/shared/utils/encryption';
import { initializeDatabase } from '@recovery/shared/db/client';

export default function App() {
  useEffect(() => {
    async function init() {
      try {
        await initializeEncryptionKey();
        await initializeDatabase();
        console.log('✅ App initialized successfully');
      } catch (error) {
        console.error('❌ App initialization failed:', error);
      }
    }
    init();
  }, []);

  // ... rest of your app
}
```

### 9. ✅ Test the Build

```bash
cd apps/mobile
npm start
# Then press 'a' for Android or 'i' for iOS
```

---

## What You Got

### 📦 Shared Package (`packages/shared/`)
- ✅ 15 constants files with all 12-step content
- ✅ 22 Zustand stores for state management
- ✅ Production-grade AES-256-GCM encryption
- ✅ Complete SQLite database (25+ tables)
- ✅ JITAI system (smart interventions)
- ✅ Notification system
- ✅ Services layer
- ✅ Type definitions

### 📱 Mobile App (`apps/mobile/`)
- ✅ 15 custom hooks
- ✅ 40+ UI components organized by feature
- ✅ Common components (ErrorBoundary, Loading, etc.)
- ✅ Feature components (achievements, meetings, step-work, etc.)
- ✅ Polyfills for cross-platform crypto
- ✅ Fonts and assets

### 📚 Documentation (`_bmad-output/reference-docs/`)
- ✅ UX principles
- ✅ Coding standards
- ✅ System architecture
- ✅ Performance guide
- ✅ Privacy policy template
- ✅ App store assets guide

---

## Quick Test

After completing steps 1-9, test with this simple component:

```typescript
// Test crisis resources
import { CRISIS_REGIONS } from '@recovery/shared/constants/crisisResources';

console.log('Crisis resources:', CRISIS_REGIONS.US.hotlines);

// Test encryption
import { encryptContent, decryptContent } from '@recovery/shared/utils/encryption';

async function testEncryption() {
  const encrypted = await encryptContent('Hello Recovery!');
  const decrypted = await decryptContent(encrypted);
  console.log('Encryption test:', decrypted); // Should print "Hello Recovery!"
}
```

---

## Troubleshooting

### Metro Bundler Errors
If you get "Unable to resolve module" errors:
1. Clear Metro cache: `npx expo start -c`
2. Delete node_modules: `rm -rf node_modules && npm install`
3. Reset Metro: `npx expo start --reset-cache`

### Encryption Errors
If you get crypto errors:
1. Ensure `polyfills.ts` is imported FIRST
2. Check that `expo-standard-web-crypto` is installed
3. Verify `react-native-get-random-values` is installed

### TypeScript Errors
If you get import path errors:
1. Verify `tsconfig.json` paths are correct
2. Restart your TypeScript server
3. Check that `@recovery/shared` package.json exists

### Build Errors
If Android/iOS build fails:
1. Clean build: `cd android && ./gradlew clean`
2. Clear pods: `cd ios && pod install --repo-update`
3. Restart dev server

---

## Next Development Steps

1. **Set up navigation** using Expo Router
2. **Create your first screen** using migrated components
3. **Test database operations** (create, read, update, delete)
4. **Test encryption** with journal entries
5. **Customize UI** using the design tokens
6. **Add authentication** using the auth store and PIN components

---

## Important Files to Review

1. `USE_FOLDER_ANALYSIS.md` - Detailed analysis of what was available
2. `MIGRATION_COMPLETE.md` - Complete migration documentation
3. `_bmad-output/reference-docs/CODING-STANDARDS.md` - Code quality guidelines
4. `_bmad-output/reference-docs/UX-PRINCIPLES.md` - UX design principles
5. `packages/shared/constants/stepPrompts.ts` - See all 12-step prompts
6. `packages/shared/db/client.ts` - Complete database schema

---

## You Can Now Delete

After verifying everything works:
- ✅ The `use` folder (but keep it for a while as reference!)

---

## Success Criteria

You'll know the migration worked when:
- ✅ App builds without errors
- ✅ You can import from `@recovery/shared`
- ✅ Encryption/decryption works
- ✅ Database initializes without errors
- ✅ Components render correctly

---

**Estimated Time**: 30-60 minutes for complete setup

**Time Saved**: 3-6 months of development work! 🎉
