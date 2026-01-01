# Android Configuration Fixes & Improvements

## Overview
Comparing your current Android setup with the working configuration from the `use` folder, here are the key differences and recommended fixes.

---

## 🔧 Critical Fixes Needed

### 1. **Enable Edge-to-Edge Mode** (Recommended)

**Issue**: Your current project has edge-to-edge disabled, but the working app has it enabled for better UI.

**Fix**: Update `apps/mobile/android/gradle.properties`

Change line 47 from:
```properties
edgeToEdgeEnabled=false
```

To:
```properties
edgeToEdgeEnabled=true
```

And line 65 from:
```properties
expo.edgeToEdgeEnabled=false
```

To:
```properties
expo.edgeToEdgeEnabled=true
```

**Why**: Edge-to-edge provides a modern, immersive UI by allowing the app to draw behind system bars.

---

### 2. **Add Missing Permissions for Recovery App Features**

**Issue**: Your AndroidManifest is missing critical permissions needed for the recovery app.

**Fix**: Update `apps/mobile/android/app/src/main/AndroidManifest.xml`

**Add these missing permissions:**

```xml
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
<uses-permission android:name="android.permission.USE_BIOMETRIC"/>
<uses-permission android:name="android.permission.USE_FINGERPRINT"/>
```

**Your current permissions** (keep these):
- ✅ `android.permission.INTERNET` - Network access
- ✅ `android.permission.VIBRATE` - Haptic feedback
- ✅ `android.permission.SYSTEM_ALERT_WINDOW` - Overlays
- ✅ `android.permission.POST_NOTIFICATIONS` - Notifications (good to have)
- ⚠️ `android.permission.ACCESS_*_LOCATION` - You have these but they're not in the use folder
  - Consider if you really need location permissions
  - They can trigger privacy concerns in app stores

**New permissions needed:**
- 🆕 `MODIFY_AUDIO_SETTINGS` - For audio journal entries
- 🆕 `RECORD_AUDIO` - For voice journal recordings
- 🆕 `USE_BIOMETRIC` - For biometric authentication (Face ID/Fingerprint)
- 🆕 `USE_FINGERPRINT` - For fingerprint authentication

---

### 3. **Update Notification Icons Metadata**

**Issue**: Your AndroidManifest is missing notification icon metadata.

**Fix**: Add to `apps/mobile/android/app/src/main/AndroidManifest.xml`

Add these `<meta-data>` tags inside the `<application>` tag:

```xml
<meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@drawable/notification_icon"/>
<meta-data android:name="expo.modules.notifications.default_notification_icon" android:resource="@drawable/notification_icon"/>
```

**Note**: You'll need to create `notification_icon.xml` in your drawable resources (see step 6).

---

### 4. **Add Update Configuration Metadata**

**Issue**: Missing Expo Updates configuration metadata.

**Fix**: Add to `apps/mobile/android/app/src/main/AndroidManifest.xml`

Add these `<meta-data>` tags inside the `<application>` tag:

```xml
<meta-data android:name="expo.modules.updates.EXPO_RUNTIME_VERSION" android:value="@string/expo_runtime_version"/>
<meta-data android:name="expo.modules.updates.EXPO_UPDATE_URL" android:value="https://u.expo.dev/YOUR_PROJECT_ID"/>
```

**Note**: Replace `YOUR_PROJECT_ID` with your actual Expo project ID (or remove if not using EAS Updates).

---

### 5. **Update App Scheme for Deep Linking**

**Issue**: Your current scheme `exp+steps-to-recovery` doesn't match a user-friendly scheme.

**Current**:
```xml
<data android:scheme="exp+steps-to-recovery"/>
```

**Recommended**:
```xml
<data android:scheme="recoverycompanion"/>
```

Or use your own custom scheme like:
```xml
<data android:scheme="stepstorecovery"/>
```

**Why**: A clean scheme is better for deep linking and sharing.

---

### 6. **Add Missing Resource Files**

You need to create notification icons. Copy these from the `use` folder:

**Option A: Copy from use folder**
```bash
# From project root
Copy-Item "use\android\app\src\main\res\drawable\notification_icon.xml" -Destination "apps\mobile\android\app\src\main\res\drawable\" -Force
Copy-Item "use\android\app\src\main\res\drawable\splashscreen.xml" -Destination "apps\mobile\android\app\src\main\res\drawable\" -Force
```

**Option B: Create notification_icon.xml manually**

Create `apps/mobile/android/app/src/main/res/drawable/notification_icon.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="@android:color/white"
        android:pathData="M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10 10,-4.48 10,-10S17.52,2 12,2zM12,5c1.66,0 3,1.34 3,3s-1.34,3 -3,3 -3,-1.34 -3,-3 1.34,-3 3,-3zM12,19.2c-2.5,0 -4.71,-1.28 -6,-3.22 0.03,-1.99 4,-3.08 6,-3.08 1.99,0 5.97,1.09 6,3.08 -1.29,1.94 -3.5,3.22 -6,3.22z"/>
</vector>
```

---

### 7. **Update ProGuard Rules**

**Issue**: Your ProGuard rules might be missing important keep rules.

**Current proguard-rules.pro** looks good, but verify it includes:

```proguard
# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add these if using encryption
-keep class expo.modules.crypto.** { *; }
-keep class expo.modules.securestore.** { *; }

# Add these if using SQLite
-keep class expo.modules.sqlite.** { *; }
```

---

## 📋 Complete Updated AndroidManifest.xml

Here's what your complete AndroidManifest should look like:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <!-- Network & System -->
  <uses-permission android:name="android.permission.INTERNET"/>
  <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
  <uses-permission android:name="android.permission.VIBRATE"/>
  
  <!-- Audio Recording (for voice journals) -->
  <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>
  <uses-permission android:name="android.permission.RECORD_AUDIO"/>
  
  <!-- Biometric Authentication -->
  <uses-permission android:name="android.permission.USE_BIOMETRIC"/>
  <uses-permission android:name="android.permission.USE_FINGERPRINT"/>
  
  <!-- Notifications -->
  <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
  <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
  <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
  
  <!-- Storage (legacy, might not be needed on newer Android) -->
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
  
  <!-- OPTIONAL: Remove these if you don't need location tracking -->
  <!-- <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION"/> -->
  <!-- <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/> -->
  <!-- <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/> -->
  
  <queries>
    <intent>
      <action android:name="android.intent.action.VIEW"/>
      <category android:name="android.intent.category.BROWSABLE"/>
      <data android:scheme="https"/>
    </intent>
  </queries>
  
  <application 
    android:name=".MainApplication" 
    android:label="@string/app_name" 
    android:icon="@mipmap/ic_launcher" 
    android:roundIcon="@mipmap/ic_launcher_round" 
    android:allowBackup="true" 
    android:theme="@style/AppTheme" 
    android:supportsRtl="true" 
    android:enableOnBackInvokedCallback="false" 
    android:fullBackupContent="@xml/secure_store_backup_rules" 
    android:dataExtractionRules="@xml/secure_store_data_extraction_rules">
    
    <!-- Notification Configuration -->
    <meta-data android:name="com.google.firebase.messaging.default_notification_color" android:resource="@color/notification_icon_color"/>
    <meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@drawable/notification_icon"/>
    <meta-data android:name="expo.modules.notifications.default_notification_color" android:resource="@color/notification_icon_color"/>
    <meta-data android:name="expo.modules.notifications.default_notification_icon" android:resource="@drawable/notification_icon"/>
    
    <!-- Expo Updates Configuration -->
    <meta-data android:name="expo.modules.updates.ENABLED" android:value="false"/>
    <meta-data android:name="expo.modules.updates.EXPO_RUNTIME_VERSION" android:value="@string/expo_runtime_version"/>
    <meta-data android:name="expo.modules.updates.EXPO_UPDATES_CHECK_ON_LAUNCH" android:value="ALWAYS"/>
    <meta-data android:name="expo.modules.updates.EXPO_UPDATES_LAUNCH_WAIT_MS" android:value="0"/>
    <!-- Add your Expo project ID if using EAS Updates -->
    <!-- <meta-data android:name="expo.modules.updates.EXPO_UPDATE_URL" android:value="https://u.expo.dev/YOUR_PROJECT_ID"/> -->
    
    <!-- Main Activity -->
    <activity 
      android:name=".MainActivity" 
      android:configChanges="keyboard|keyboardHidden|orientation|screenSize|screenLayout|uiMode" 
      android:launchMode="singleTask" 
      android:windowSoftInputMode="adjustResize" 
      android:theme="@style/Theme.App.SplashScreen" 
      android:exported="true" 
      android:screenOrientation="portrait">
      
      <!-- App Launcher -->
      <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
      </intent-filter>
      
      <!-- Deep Linking -->
      <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        <data android:scheme="stepstorecovery"/>
      </intent-filter>
    </activity>
  </application>
</manifest>
```

---

## 🎨 Copy Missing Resource Files

Run these commands to copy necessary resources from the `use` folder:

```powershell
# Copy notification icon
Copy-Item "use\android\app\src\main\res\drawable\notification_icon.xml" `
  -Destination "apps\mobile\android\app\src\main\res\drawable\notification_icon.xml" -Force

# Copy splash screen if needed
Copy-Item "use\android\app\src\main\res\drawable\splashscreen.xml" `
  -Destination "apps\mobile\android\app\src\main\res\drawable\splashscreen.xml" -Force

# Copy values if needed
Copy-Item "use\android\app\src\main\res\values\*" `
  -Destination "apps\mobile\android\app\src\main\res\values\" -Recurse -Force
```

---

## 🔍 What's Already Good in Your Current Setup

Your current Android configuration already has these correct:
- ✅ Correct gradle.properties JVM settings (2048m)
- ✅ New Architecture enabled (newArchEnabled=true)
- ✅ Hermes enabled (hermesEnabled=true)
- ✅ Correct build.gradle structure
- ✅ Proper Expo autolinking setup
- ✅ Correct signing configs
- ✅ GIF and WebP support enabled

---

## ⚠️ Optional: Location Permissions Cleanup

**Consider removing location permissions if you don't need them:**

Your app currently requests:
- `ACCESS_BACKGROUND_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `ACCESS_FINE_LOCATION`

The `use` folder app **doesn't** have these permissions.

**Why remove them?**
- Privacy-focused recovery apps shouldn't need location
- Users are more likely to trust an app that doesn't track location
- App store approval can be easier without location permissions

**To remove**: Delete these lines from AndroidManifest.xml:
```xml
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```

---

## 🚀 Testing After Changes

After making these changes:

1. **Clean the build**:
```bash
cd apps/mobile/android
./gradlew clean
cd ..
```

2. **Rebuild the app**:
```bash
npm run android
# or
npx expo run:android
```

3. **Test these features**:
- ✅ Biometric authentication works
- ✅ Audio recording for voice journals
- ✅ Notifications display correctly
- ✅ Deep linking works
- ✅ Edge-to-edge UI looks good
- ✅ No permission errors in logcat

4. **Check logcat for errors**:
```bash
adb logcat | grep -E "(AndroidRuntime|ReactNative|Expo)"
```

---

## 📝 Summary of Changes

### Immediate Changes:
1. ✅ Enable edge-to-edge mode in gradle.properties
2. ✅ Add biometric permissions to AndroidManifest
3. ✅ Add audio recording permissions to AndroidManifest
4. ✅ Add notification icon metadata
5. ✅ Update deep linking scheme
6. ✅ Copy notification icon drawable

### Optional Changes:
7. ⚠️ Remove location permissions (recommended)
8. ⚠️ Update ProGuard rules for encryption/SQLite
9. ⚠️ Add Expo Updates URL if using EAS

### Already Good:
- ✅ Build configuration
- ✅ Gradle settings
- ✅ New Architecture
- ✅ Hermes
- ✅ Image format support

---

## 🎯 Quick Action Script

Save time with this PowerShell script:

```powershell
# Run from project root

# 1. Update gradle.properties
(Get-Content apps\mobile\android\gradle.properties) -replace 'edgeToEdgeEnabled=false', 'edgeToEdgeEnabled=true' | Set-Content apps\mobile\android\gradle.properties
(Get-Content apps\mobile\android\gradle.properties) -replace 'expo.edgeToEdgeEnabled=false', 'expo.edgeToEdgeEnabled=true' | Set-Content apps\mobile\android\gradle.properties

# 2. Copy notification icon
New-Item -ItemType Directory -Force -Path "apps\mobile\android\app\src\main\res\drawable"
Copy-Item "use\android\app\src\main\res\drawable\notification_icon.xml" -Destination "apps\mobile\android\app\src\main\res\drawable\" -Force

# 3. Copy other resource files
Copy-Item "use\android\app\src\main\res\values\*" -Destination "apps\mobile\android\app\src\main\res\values\" -Recurse -Force

Write-Host "✅ Android configuration updated!"
Write-Host "⚠️  Manually update AndroidManifest.xml permissions (see ANDROID_FIXES.md)"
```

---

## 🛟 Troubleshooting

### Issue: App crashes on startup
- Check logcat for permission errors
- Verify all required permissions are in AndroidManifest
- Ensure notification icons exist

### Issue: Biometric auth not working
- Verify `USE_BIOMETRIC` and `USE_FINGERPRINT` permissions are added
- Check device supports biometric authentication
- Test on a real device (emulators may not support biometrics)

### Issue: Audio recording fails
- Verify `RECORD_AUDIO` and `MODIFY_AUDIO_SETTINGS` permissions
- Request runtime permissions in your app code
- Check microphone access in device settings

### Issue: Edge-to-edge not working
- Verify both gradle.properties flags are set to `true`
- Check your theme supports edge-to-edge
- May need to adjust your UI components for insets

---

**Status**: ✅ **Ready to implement**  
**Difficulty**: 🟢 **Easy** (mostly copy/paste changes)  
**Time Required**: ⏱️ **15-30 minutes**  
**Impact**: 💥 **High** (fixes critical features)
