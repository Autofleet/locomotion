# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a React Native mobile app for the Locomotion ride-sharing platform. The app allows users to book rides, track active rides, manage payments, view ride history, and communicate with drivers.

## Common Development Commands

### Building and Running
- `npm run android` - Run Android app
- `npm run ios` - Run iOS app  
- `npm start` - Start React Native metro bundler
- `npm run build-android` - Build Android release APK
- `npm run clean-android` - Clean Android build
- `npm run clean-ios-build` - Clean iOS build
- `npm run clean-ios-pods` - Clean iOS pods and caches
- `npm run install-ios` - Install iOS dependencies via pod

### Testing and Linting
- `npm test` - Run Jest tests
- `npm run linter` - Run ESLint on source files
- `npm run ts` - Run TypeScript compiler

### Development Tools
- `npm run dev` - Watch locomotion-sdk changes and symlink (for SDK development)
- `npm run postinstall` - Run patch-package and jetify after install

## Architecture Overview

### Entry Point and App Structure
- `index.js` - React Native entry point
- `App.tsx` - Main app component
- `src/index.js` - Main export file
- `src/LocomotionRouter.js` - Main app router with navigation setup and provider hierarchy

### Context Architecture
The app uses React Context extensively for state management:
- `src/context/main.js` - Main provider wrapper containing all sub-providers
- `src/context/state/` - Global state management
- `src/context/user/` - User authentication and profile data
- `src/context/rides/` - Ride booking and management
- `src/context/newRideContext/` - New ride creation flow
- `src/context/ridePageStateContext/` - Active ride page state
- `src/context/payments/` - Payment methods and transactions
- `src/context/futureRides/` - Scheduled ride management
- `src/context/messages/` - In-app messaging
- `src/context/bottomSheetContext/` - Bottom sheet UI state
- `src/context/settings/` - App settings and preferences

### Navigation Structure
- `src/pages/routes.js` - Route constants and component mappings
- `src/pages/routeConsts.js` - Route name constants
- React Navigation v6 with native stack navigation
- Main routes include: Home (ActiveRide), Profile screens, Payments, Ride History, Messages

### Key Services
- `src/services/auth.js` - Authentication logic
- `src/services/network.js` - API communication
- `src/services/geo.js` - Location services
- `src/services/firebase.js` - Firebase integration
- `src/services/Mixpanel.js` - Analytics
- `src/services/one-signal/` - Push notifications
- `src/services/appsflyer.ts` - Attribution tracking

### UI Components
- `src/Components/` - Reusable UI components
- `src/popups/` - Modal and popup components
- Styled with `styled-components`
- Custom theming system in `src/context/theme/`

### Key Technologies
- React Native 0.71.0
- React Navigation v6
- TypeScript (partial migration from JavaScript)
- Styled Components for styling
- React Native Maps for mapping
- Firebase for crashlytics and analytics
- OneSignal for push notifications
- Stripe for payments
- i18next for internationalization

### Development Notes
- The app supports both iOS and Android platforms
- Uses patch-package for React Native dependency modifications
- SVG support configured via metro.config.js
- Custom fonts configured in react-native.config.js
- Extensive use of React Context for state management instead of Redux
- Bottom sheet UI pattern used throughout the app
- Real-time ride tracking and messaging features