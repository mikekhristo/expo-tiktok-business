// Reexport the native module. On web, it will be resolved to TiktokSDKModule.web.ts
// and on native platforms to TiktokSDKModule.ts
export { default } from "./TiktokSDKModule";
export { default as TiktokSDKView } from "./TiktokSDKView";
export * from "./TiktokSDK.types";

// Export Expo Router integration utilities
export { 
  default as ExpoRouterIntegration,
  useTiktokRouteTracking,
  withTiktokRouteTracking
} from "./ExpoRouterIntegration";
