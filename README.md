# StoreAppFinal

A cross-platform mobile store application built with React Native. This app allows users to browse products, add items to a cart, and place orders. It is designed for both Android and iOS platforms.

---

## Features
- Browse products on the home screen
- Add/remove items from the cart
- View cart and order confirmation screens
- State management with Redux
- Modern UI and smooth navigation

---

## Project Structure
```
StoreAppFinal/
├── __tests__/                  # Test files
├── android/                    # Android native project
│   └── app/
│       ├── build.gradle        # App-level Gradle config
│       └── ...
├── ios/                        # iOS native project
│   └── StoreAppFinal/
│       └── ...
├── redux/                      # Redux store and slices
│   ├── cartSlice.js
│   └── store.js
├── screens/                    # App screens
│   ├── CartScreen.js
│   ├── HomeScreen.js
│   └── OrderConfirmationScreen.js
├── App.tsx                     # Main app entry (TypeScript)
├── index.js                    # Entry point
├── package.json                # NPM dependencies
├── README.md                   # Project documentation
└── ...
```

---

## Getting Started

### Prerequisites
- Node.js (v14 or newer recommended)
- npm or yarn
- Java JDK 11 or 17 (for Android build)
- Android Studio (for Android SDK)
- Xcode (for iOS, macOS only)

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd StoreAppFinal
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Install pods for iOS (macOS only):
   ```sh
   cd ios
   pod install
   cd ..
   ```

---

## Running the App

### Android (Debug)
```sh
npx react-native run-android
```

### iOS (Debug, macOS only)
```sh
npx react-native run-ios
```

---

## Building a Release APK (Android)

1. **Generate a Keystore** (if you don't have one):
   ```sh
   keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
   Place `my-release-key.keystore` in `android/app/`.

2. **Configure `android/gradle.properties`:**
   Add the following lines (replace with your values):
   ```
   MYAPP_UPLOAD_STORE_FILE=my-release-key.keystore
   MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
   MYAPP_UPLOAD_STORE_PASSWORD=your-store-password
   MYAPP_UPLOAD_KEY_PASSWORD=your-key-password
   ```

3. **Configure signing in `android/app/build.gradle`:**
   Ensure the `signingConfigs` and `buildTypes` blocks are set up for release builds.

4. **Build the APK:**
   ```sh
   cd android
   .\gradlew assembleRelease
   ```
   The APK will be generated at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## Troubleshooting
- **Gradle errors:**
  - Ensure there is no `android { ... }` block in `android/build.gradle` (should only be in `android/app/build.gradle`).
  - Make sure all required environment variables (`JAVA_HOME`, `ANDROID_HOME`) are set.
- **Metro bundler issues:**
  - Restart the bundler: `npx react-native start --reset-cache`
- **Dependency issues:**
  - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- **Android build fails:**
  - Check for correct keystore setup and signing configuration.

---

## License

This project is for educational purposes. Add your license here if needed.
