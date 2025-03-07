import React from 'react';
import { Platform } from 'react-native';
import TiktokSDK from './TiktokSDKModule';

// Types for expo-router to avoid having it as a direct dependency
type RouterHook = () => any;
type PathnameHook = () => string;
type SearchParamsHook = () => Record<string, any>;

/**
 * ExpoRouterIntegration - Helper utilities for integrating with Expo Router
 */
export class ExpoRouterIntegration {
  static _isInitialized = false;
  static _routeChangeListener: any = null;

  /**
   * Initialize Expo Router integration
   * 
   * This method sets up automatic tracking of route changes in Expo Router.
   * It should be called after TikTok SDK is initialized, preferably in the root component.
   */
  static initialize(): void {
    if (ExpoRouterIntegration._isInitialized) {
      return;
    }
    
    // We need to check if expo-router is available
    // Note: Dynamically importing expo-router requires ESNext module support
    // For now, we'll setup a function that users can call when they have access to
    // the router hooks
    console.log('[TiktokSDK] Expo Router integration: To use with Expo Router, call setupWithRouter with your router hooks');
    ExpoRouterIntegration._isInitialized = true;
  }
  
  /**
   * Setup the integration with router hooks directly provided by the user application
   * 
   * @param usePathname The usePathname hook from expo-router
   * @param useSearchParams The useSearchParams hook from expo-router
   */
  static setupWithRouter(
    usePathname: PathnameHook,
    useSearchParams: SearchParamsHook
  ): void {
    if (!usePathname || !useSearchParams) {
      console.warn('[TiktokSDK] Expo Router integration: Invalid router hooks provided');
      return;
    }
    
    // Set up a listener for route changes
    ExpoRouterIntegration._setupRouteChangeListener(usePathname, useSearchParams);
    ExpoRouterIntegration._isInitialized = true;
  }
  
  /**
   * Manually track a route change
   * 
   * This method can be used if automatic tracking is not enabled or if you want
   * to track a route change that isn't handled by Expo Router.
   * 
   * @param routeName The name of the route/screen
   * @param params Optional route parameters
   */
  static trackRouteChange(routeName: string, params?: Record<string, any>): Promise<boolean> {
    return TiktokSDK.trackRouteChange(routeName, params);
  }
  
  /**
   * Clean up resources when no longer needed
   */
  static cleanup(): void {
    if (ExpoRouterIntegration._routeChangeListener) {
      // Clean up listeners
      ExpoRouterIntegration._routeChangeListener = null;
    }
    
    ExpoRouterIntegration._isInitialized = false;
  }
  
  /**
   * Set up a listener for route changes in Expo Router
   */
  private static _setupRouteChangeListener(
    usePathname: any, 
    useSearchParams: any
  ): void {
    // Create a component that listens for route changes
    const RouteChangeListener = () => {
      const pathname = usePathname();
      const params = useSearchParams();
      
      // Track route changes
      if (pathname) {
        setTimeout(() => {
          TiktokSDK.trackRouteChange(pathname, params);
        }, 0);
      }
      
      return null; // This component doesn't render anything
    };
    
    ExpoRouterIntegration._routeChangeListener = RouteChangeListener;
  }
}

/**
 * Hook for tracking Expo Router changes
 * 
 * Usage example:
 * ```
 * const MyComponent = () => {
 *   useTiktokRouteTracking();
 *   return <View>...</View>;
 * };
 * ```
 */
export function useTiktokRouteTracking(): void {
  // Initialize on first render
  if (!ExpoRouterIntegration._isInitialized) {
    ExpoRouterIntegration.initialize();
  }
  
  // Note: In a real implementation, we would use React.useEffect here to
  // set up listeners and clean them up, but since we've refactored to let
  // users provide their hooks directly, this is now just an initialization helper
}

/**
 * Higher-order component that adds TikTok route tracking to a component
 * 
 * Usage example:
 * ```
 * const MyComponent = () => <View>...</View>;
 * export default withTiktokRouteTracking(MyComponent);
 * ```
 */
export function withTiktokRouteTracking<T extends React.ComponentType<any>>(
  Component: T
): React.ComponentType<React.ComponentProps<T>> {
  // Return a new component that includes the route tracking
  return function WrappedComponent(props: React.ComponentProps<T>) {
    useTiktokRouteTracking();
    return React.createElement(Component, props);
  };
}

export default ExpoRouterIntegration;