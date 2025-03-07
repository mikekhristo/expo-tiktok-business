# CLAUDE.md - Expo TikTok Business SDK

## Commands
- Build: `npm run build`
- Clean: `npm run clean`
- Lint: `npm run lint`
- Test: `npm run test`
- Prepare: `npm run prepare`
- Open iOS: `npm run open:ios`
- Open Android: `npm run open:android`
- Example app: `cd example && npm run ios/android/web`

## Code Style Guidelines
- **TypeScript**: Use strict typing with interfaces in TiktokSDK.types.ts
- **Naming**: PascalCase for components/classes, camelCase for variables/functions
- **Imports**: Group by external dependencies, then internal modules
- **Error Handling**: Use try/catch blocks and propagate errors with proper context
- **Platform Specific**: Use .ios.ts, .android.ts, and .web.ts extensions for platform code
- **Module Structure**: Follow Expo module conventions (expo-module-scripts)
- **Documentation**: Include JSDoc comments for public API methods

## Architecture Notes
- Native SDK integration through module + view approach
- iOS implementation in Swift, Android in Kotlin
- Web fallbacks where appropriate