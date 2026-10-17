# Android APK Build Guide

Follow these steps to generate your Android APK using Capacitor and Android Studio.

## Prerequisites
- **Android Studio** installed on your machine.
- **Node.js** installed.

## Workflow

### 1. Build the Web App
Every time you make changes to your React application code, you must rebuild it so Capacitor can package the latest version.
```bash
npm run build
```

### 2. Sync Web Assets to Android
Copy the built web files (`dist` folder) into the native Android project directory.
```bash
npx cap sync android
```

### 3. Open in Android Studio
Open the generated Android project in Android Studio.
```bash
npx cap open android
```

### 4. Build the APK in Android Studio
1.  Once Android Studio opens, wait for the Gradle sync to complete.
2.  Navigate to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3.  Android Studio will generate an APK file, which you can find in the `app/build/outputs/apk/debug/` directory (or release directory if you sign the app).

## Troubleshooting
- If you encounter issues during sync, ensure your `capacitor.config.ts` has the correct `webDir: 'dist'`.
- Ensure your `package.json` has `build` script set to `vite build`.
