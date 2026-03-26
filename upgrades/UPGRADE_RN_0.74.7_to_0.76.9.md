# React Native Upgrade: 0.74.7 → 0.76.9

**Branch:** `upgrade-to-0.76`
**Scope:** 282 files changed (+7,870 / -10,008 lines), 18 commits

---

## Major Changes

### 1. React Native 0.74.7 → 0.76.9
- Core framework upgrade with React 18.2.0 → 18.3.1
- All `@react-native/*` packages bumped to 0.76.9 (`babel-preset`, `eslint-config`, `metro-config`, `typescript-config`, `gradle-plugin`)

### 2. New Architecture (Fabric) Enabled
- **Android:** `newArchEnabled=true` in `gradle.properties` — required for `react-native-gesture-handler` 2.30.x (`ViewManagerWithGeneratedInterface`)
- **iOS:** Removed legacy `sourceURLForBridge:` and `concurrentRootEnabled` from `AppDelegate.mm` — New Architecture is now the default

### 3. Android Build System Overhaul
- **Kotlin:** 1.9.22 → 2.0.21 (required for gesture-handler 2.30.x)
- **Gradle wrapper:** 8.9 → 8.11.1
- **AGP:** 8.7.0 → 8.6.0
- **NDK:** 26.1.10909125 → 27.1.12297006
- Migrated `app/build.gradle` from legacy `apply plugin:` to `plugins {}` DSL
- Removed deprecated build config: APK splits, `jscFlavor`, Hermes/JSC conditional logic, `enableSeparateBuildPerCPUArchitecture`, `enableProguardInReleaseBuilds`
- **settings.gradle** restructured with `pluginManagement` and `com.facebook.react.settings` plugin; removed all manual `include ':library'` declarations (now auto-linked)
- **Root build.gradle fix:** Added `classpath("com.facebook.react:react-native-gradle-plugin")` to make the plugin available to library modules using legacy `apply plugin:` via classpath inheritance
- **Root settings.gradle fix:** Added root-level `includeBuild("../node_modules/@react-native/gradle-plugin")` for dependency substitution

### 4. iOS Build Simplification
- Removed ~140 lines of Hermes bitcode stripping logic from `Podfile`
- Removed explicit `ENABLE_BITCODE = 'NO'` configuration
- Removed React-Codegen build settings overrides (`SWIFT_VERSION`, `IPHONEOS_DEPLOYMENT_TARGET`)
- Platform target changed from hardcoded `'13.4'` to dynamic `min_ios_version_supported`
- Simplified `post_install` block to just `react_native_post_install()`
- Removed `require_relative` for `@react-native-community/cli-platform-ios` (auto-linked)

### 5. Ruby 3.2.2 → 4.0.2
- Major Ruby version upgrade
- CocoaPods constraint updated: `'>= 1.13', '< 1.15'` → `'>= 1.15', '< 1.17'`
- Removed version constraints on `xcodeproj` and `concurrent-ruby` gems

### 6. Stripe Upgrade 0.35.1 → 0.59.2
- Major version bump of `@stripe/stripe-react-native`
- **New patch** (`@stripe+stripe-react-native+0.59.2.patch`): Creates missing iOS Fabric component stubs (`ConnectAccountOnboardingViewComponentView`, `PaymentMethodMessagingElementViewComponentView`) to fix linker errors

### 7. react-native-modal → CompatModal Wrapper
- Created new `CompatModal` component (`src/Components/CompatModal/index.tsx`) using React Native's native `Modal` with `transparent` and `animationType="fade"`
- Fixes Android popup rendering issues with the third-party `react-native-modal` under RN 0.76
- All popups migrated: `GenericPopup`, `GenericError`, `RideNotes`, `CancellationReasonsPopup`, `ChoosePaymentMethod`, `ConfirmationPopup`, `DatePickerPopup`, `FareBreakdownPopup`, `FutureRideCanceled`, `RideCanceledPopup`, `Selector`, `TemporaryHoldLearnMore`, `TwoButtonPopup`, `SelectModal`, `BasicPopup`
- **GenericError** special case: Uses native `Alert.alert()` on Android instead of custom modal

### 8. react-native-svg 12.3 → 15.11 + SVG Country Flags
- Major `react-native-svg` upgrade with `react-native-svg-transformer` 1.3 → 1.5
- **New `CountryFlag` component** (`src/Components/PhoneNumberInput/CountryFlag.js`): Renders SVG flags via `country-flag-icons` package instead of emoji
- **Why:** iOS TextKit2 in RN 0.76 breaks Regional Indicator emoji sequences used for country flags
- **Metro config** (`metro.config.js`): Added custom `resolveRequest` to intercept `react-native-country-picker-modal`'s `./Flag` import and redirect to the SVG implementation

### 9. react-native-gesture-handler 2.16.2 → 2.30.0
- Required enabling New Architecture on Android
- This was the primary driver for enabling `newArchEnabled=true`

### 10. Skeleton Library Swap
- Removed `react-native-skeleton-placeholder` (5.2.4)
- Added `react-native-reanimated-skeleton` (1.6.0) as replacement
- `react-native-reanimated` updated: 3.15.0 → 3.16.7

### 11. Removed Deprecated Packages
- `react-native-exit-app` (2.0.0) — removed from dependencies and iOS Podfile
- `@react-native-masked-view/masked-view` (0.2.8) — no longer needed in RN 0.76
- Removed `jetify` from postinstall script (RN 0.76 handles AndroidX natively)
- Removed Flipper (`FLIPPER_VERSION` removed from `gradle.properties`)

### 12. RN 0.76.9 Patch
- **Patch file** (`react-native+0.76.9.patch`):
  - Fixes `promiseRejectionTrackingOptions.js`: Wraps `rejection.stack` access in try-catch to prevent Hermes engine crashes
  - Adds `RCTThirdPartyFabricComponentsProvider` files: Registers Fabric component providers for Lottie, GestureHandler, SafeArea, Screens, and WebView
  - Adds `.packager.env` with `RCT_METRO_PORT=8081`

---

## Minor Changes

### Code Quality & TypeScript Migration
1. **propTypes → TypeScript interfaces** across 50+ components (BsPages, CardRow, CloseButton, EmptyState, InformationCard, LinkText, NoTitleCard, PageHeader, RidePaymentDetails, RoundedButton, SelectModal, SquareSvgButton, TabSwitch, TextButton, TextRowWithIcon, Toast, VirtualStation components, etc.)
2. **defaultProps → destructured default parameters** in function signatures
3. **Arrow functions → named function declarations** (`const Foo = () =>` → `function Foo()`)
4. **Prop spreading removal** (`{...props}` → explicit typed prop destructuring for self-documenting APIs)
5. **SvgIcon** converted from JS to TypeScript (`index.js` → `index.tsx`)

### New Type Definitions
6. `src/types/react-native-extensions.d.ts` — extends `UIManagerStatic` with `showPopupMenu()`
7. `src/types/styled-components-native.d.ts` — module declaration for styled-components/native
8. `src/types/turf.d.ts` — type definitions for `@turf/turf` GeoJSON utilities
9. `src/i18n-setup.d.ts` — i18next type augmentation ensuring `t()` always returns `string`
10. `src/pages/routeConsts.d.ts` — route constants type declaration
11. `src/Components/SafeView/index.d.ts` — SafeView type declaration

### Build & Tooling
12. **ESLint upgrades:** `eslint` 8.19 → 8.57, `eslint-config-airbnb` 17.1 → 19.0, `eslint-watch` 3.1 → 8.0
13. **Babel upgrades:** `@babel/core`, `@babel/preset-env`, `@babel/runtime` all 7.20 → 7.25
14. **`.eslintignore`** file added
15. `@react-native-community/cli` 10.2 → 15.0
16. `@react-native-community/geolocation` 3.1 → 3.4

### UI & Popup Fixes
17. **RideNotes modal:** Content aligned to top with new `StyledModal` styled component and `padding-top: 30px`
18. **Selector popup:** `styled.js` renamed to `styled.ts`
19. Minor formatting and import cleanup across services and context providers
20. `react-dom` updated 17.0.2 → 18.3.1 (aligns with React 18.3)

---

## Build Verification
- **iOS:** BUILD SUCCEEDED (warnings only — old pod deployment targets, harmless)
- **Android:** BUILD SUCCEEDED (1056 tasks, ~7 min)
