# Gradle Build Error Fix

## Error
```
Plugin with id 'com.android.library' not found
A problem occurred evaluating root project 'android'
```

## Root Cause

The `build.gradle` file has an incomplete Android Gradle plugin declaration. It's missing the version number.

**Current (broken)**:
```gradle
classpath('com.android.tools.build:gradle')
```

**Should be**:
```gradle
classpath('com.android.tools.build:gradle:8.7.3')
```

---

## Quick Fix

### Option 1: Manual Fix

Update `apps/mobile/android/build.gradle`:

**Find line 9:**
```gradle
classpath('com.android.tools.build:gradle')
```

**Replace with:**
```gradle
classpath('com.android.tools.build:gradle:8.7.3')
```

### Option 2: Copy Working Configuration

Copy the working `build.gradle` from the `use` folder:

```powershell
Copy-Item "use\android\build.gradle" -Destination "apps\mobile\android\build.gradle" -Force
```

---

## Complete Fixed build.gradle

Your `apps/mobile/android/build.gradle` should look like this:

```gradle
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
  repositories {
    google()
    mavenCentral()
  }
  dependencies {
    classpath('com.android.tools.build:gradle:8.7.3')
    classpath('com.facebook.react:react-native-gradle-plugin')
    classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')
  }
}

allprojects {
  repositories {
    google()
    mavenCentral()
    maven { url 'https://www.jitpack.io' }
  }
}

apply plugin: "expo-root-project"
apply plugin: "com.facebook.react.rootproject"
```

**Key change**: Added version `8.7.3` to the Android Gradle plugin.

---

## Additional Fixes

### Fix settings.gradle Maven URL

Your `settings.gradle` line 19 has:
```gradle
maven { url = uri('https://www.jitpack.io') }
```

But `build.gradle` has:
```gradle
maven { url 'https://www.jitpack.io' }
```

**Update `apps/mobile/android/build.gradle` line 19** for consistency:
```gradle
maven { url 'https://www.jitpack.io' }
```

---

## Why This Happens

In Gradle, when you don't specify a version for a classpath dependency, it can't resolve the plugin properly. The Android Gradle plugin requires an explicit version number.

**Gradle 8.x requires**:
- Android Gradle Plugin (AGP) version 8.7.x or higher
- Explicit version declarations
- Proper repository configuration

---

## Testing the Fix

After applying the fix:

### 1. Clean Everything
```bash
cd apps/mobile/android
./gradlew clean
rm -rf .gradle
cd ../../..
```

### 2. Sync Gradle
```bash
cd apps/mobile/android
./gradlew --refresh-dependencies
cd ../..
```

### 3. Rebuild
```bash
npm run android
```

---

## If You Still Get Errors

### Error: "Unsupported class file major version"

This means your Java version doesn't match. Expo SDK 54 requires Java 17 or 21.

**Fix**:
```powershell
# Check Java version
java -version

# Should show version 17 or 21
```

If not, install Java 17 or 21 and set `JAVA_HOME`.

### Error: "Could not resolve dependencies"

**Fix**:
```bash
cd apps/mobile
rm -rf node_modules
npm install
cd android
./gradlew clean
./gradlew --refresh-dependencies
```

### Error: Still can't find 'com.android.library'

**Nuclear option - Delete all Gradle caches**:
```bash
# Delete global Gradle cache
rm -rf ~/.gradle/caches/

# Delete project caches
cd apps/mobile/android
rm -rf .gradle
rm -rf build
rm -rf app/build

# Rebuild
./gradlew clean
cd ../..
npm run android
```

---

## Version Compatibility

For Expo SDK 54 with React Native 0.81:

| Component | Version |
|-----------|---------|
| Gradle | 8.14.3 ✅ |
| Android Gradle Plugin (AGP) | 8.7.3 ✅ |
| Kotlin | 1.9.x+ ✅ |
| Java/JDK | 17 or 21 ✅ |
| compileSdk | 35 ✅ |
| targetSdk | 35 ✅ |
| minSdk | 23+ ✅ |

Your current versions are correct, just missing the AGP version number!

---

## Prevention

Always specify exact versions in your Gradle files:

**Good**:
```gradle
classpath('com.android.tools.build:gradle:8.7.3')
```

**Bad**:
```gradle
classpath('com.android.tools.build:gradle') // No version!
classpath('com.android.tools.build:gradle:+') // Latest - unstable!
```

---

## Summary

**The Fix**: Add `:8.7.3` to line 9 of `apps/mobile/android/build.gradle`

**Before**:
```gradle
classpath('com.android.tools.build:gradle')
```

**After**:
```gradle
classpath('com.android.tools.build:gradle:8.7.3')
```

Then run:
```bash
cd apps/mobile/android && ./gradlew clean && cd ../.. && npm run android
```

**Time to fix**: ⏱️ 2 minutes  
**Difficulty**: 🟢 Very Easy
