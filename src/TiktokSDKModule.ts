import { NativeModule, requireNativeModule } from "expo";
import { AppStateStatus, AppState, Platform } from "react-native";
import Constants from "expo-constants";

import { 
  TiktokSDKModuleEvents, 
  TiktokEventName, 
  TiktokSDKConfig,
  TiktokEventParams,
  TiktokPlatformAppIds
} from "./TiktokSDK.types";

/**
 * Native module interface
 */
declare class TiktokSDKModule extends NativeModule<TiktokSDKModuleEvents> {
  initialize(config: TiktokSDKConfig): Promise<boolean>;
  setDebugMode(enabled: boolean): Promise<boolean>;
  trackEvent(
    eventName: string,
    eventData: Record<string, any>
  ): Promise<boolean>;
  trackRouteChange(
    routeName: string, 
    params?: Record<string, any>
  ): Promise<boolean>;
}

// Get the native module
const nativeModule = requireNativeModule<TiktokSDKModule>("TiktokSDK");

/**
 * TikTok Business SDK wrapper class
 */
class TiktokSDK {
  private _isInitialized: boolean = false;
  private _config?: TiktokSDKConfig;
  private _appStateSubscription: any = null;

  /**
   * Get the bundle ID or package name for the current platform
   * @private
   */
  private _getPlatformAppId(
    appId: string | { ios?: string; android?: string; default: string }
  ): string {
    if (typeof appId === 'string') {
      return appId;
    }
    
    const platform = Platform.OS;
    if (platform === 'ios' && appId.ios) {
      return appId.ios;
    } else if (platform === 'android' && appId.android) {
      return appId.android;
    }
    
    return appId.default;
  }
  
  /**
   * Get the TikTok App ID for the current platform
   * @private
   */
  private _getPlatformTikTokAppId(
    tiktokAppId: string | TiktokPlatformAppIds
  ): string {
    if (typeof tiktokAppId === 'string') {
      return tiktokAppId;
    }
    
    const platform = Platform.OS;
    if (platform === 'ios' && tiktokAppId.ios) {
      return tiktokAppId.ios;
    } else if (platform === 'android' && tiktokAppId.android) {
      return tiktokAppId.android;
    }
    
    return tiktokAppId.default;
  }
  
  /**
   * Try to get the app's bundle ID/package name from Expo Constants
   * @private
   */
  private _tryGetExpoBundleId(): string | null {
    try {
      // Try to get the bundle ID from Expo Constants
      const { manifest } = Constants;
      if (manifest) {
        // For Expo SDK 46 and above
        if (manifest.extra && manifest.extra.expoClient) {
          if (Platform.OS === 'ios' && manifest.extra.expoClient.ios && manifest.extra.expoClient.ios.bundleIdentifier) {
            return manifest.extra.expoClient.ios.bundleIdentifier;
          } else if (Platform.OS === 'android' && manifest.extra.expoClient.android && manifest.extra.expoClient.android.package) {
            return manifest.extra.expoClient.android.package;
          }
        }
        
        // For older Expo SDK versions
        if (Platform.OS === 'ios' && manifest.ios && manifest.ios.bundleIdentifier) {
          return manifest.ios.bundleIdentifier;
        } else if (Platform.OS === 'android' && manifest.android && manifest.android.package) {
          return manifest.android.package;
        }
      }
    } catch (error) {
      console.warn('TiktokSDK: Failed to get bundle ID from Expo Constants', error);
    }
    
    return null;
  }

  /**
   * Initialize the TikTok Business SDK
   * @param appIdParam Your app ID or platform-specific app IDs
   * @param tiktokAppIdParam Your TikTok app ID or platform-specific TikTok app IDs
   * @param options Additional configuration options
   */
  async initialize(
    appIdParam: string | { ios?: string; android?: string; default: string },
    tiktokAppIdParam: string | TiktokPlatformAppIds,
    options: {
      debugMode?: boolean;
      autoTrackAppLifecycle?: boolean;
      autoTrackRouteChanges?: boolean;
    } = {}
  ): Promise<boolean> {
    // Get platform-specific app ID
    let appId: string;
    if (typeof appIdParam === 'string') {
      appId = appIdParam;
    } else {
      appId = this._getPlatformAppId(appIdParam);
    }
    
    // Get platform-specific TikTok app ID
    let tiktokAppId: string;
    if (typeof tiktokAppIdParam === 'string') {
      tiktokAppId = tiktokAppIdParam;
    } else {
      tiktokAppId = this._getPlatformTikTokAppId(tiktokAppIdParam);
    }
    
    // Create config
    const config: any = {
      appId,
      tiktokAppId,
      debugMode: options.debugMode || false,
      autoTrackAppLifecycle: options.autoTrackAppLifecycle !== false, // default to true
      autoTrackRouteChanges: options.autoTrackRouteChanges !== false, // default to true,
    };

    this._config = config;
    
    if (config.debugMode) {
      console.log(`TiktokSDK: Initializing for ${Platform.OS} with appId=${appId}, tiktokAppId=${tiktokAppId}`);
    }
    
    // Initialize the native SDK
    const success = await nativeModule.initialize(config);
    this._isInitialized = success;
    
    // Set up app state change listener if lifecycle tracking is enabled
    if (success && config.autoTrackAppLifecycle) {
      this._setupAppStateListener();
    }
    
    return success;
  }

  /**
   * Set debug mode for the SDK
   * @param enabled Whether to enable debug mode
   */
  async setDebugMode(enabled: boolean): Promise<boolean> {
    return nativeModule.setDebugMode(enabled);
  }

  /**
   * Track a standard or custom event
   * @param eventName Event name (use TiktokEventName for standard events)
   * @param eventParams Event parameters
   */
  async trackEvent(
    eventName: TiktokEventName | string, 
    eventParams: TiktokEventParams = {}
  ): Promise<boolean> {
    if (!this._isInitialized) {
      console.warn("TiktokSDK: SDK not initialized. Call initialize() first.");
      return false;
    }

    return nativeModule.trackEvent(eventName, eventParams);
  }
  
  /**
   * Track a route change (screen view) - useful for manual tracking
   * @param routeName The name of the route/screen
   * @param params Optional route parameters
   */
  async trackRouteChange(
    routeName: string, 
    params?: Record<string, any>
  ): Promise<boolean> {
    if (!this._isInitialized) {
      return false;
    }
    
    return nativeModule.trackRouteChange(routeName, params);
  }
  
  /**
   * Helper: Track a search event
   * @param searchString The search query
   * @param additionalParams Additional event parameters
   */
  async trackSearch(
    searchString: string, 
    additionalParams: TiktokEventParams = {}
  ): Promise<boolean> {
    return this.trackEvent(TiktokEventName.SEARCH, {
      search_string: searchString,
      ...additionalParams,
    });
  }
  
  /**
   * Helper: Track a content view
   * @param contentId Content ID
   * @param contentType Content type
   * @param additionalParams Additional event parameters
   */
  async trackViewContent(
    contentId: string,
    contentType: string,
    additionalParams: TiktokEventParams = {}
  ): Promise<boolean> {
    return this.trackEvent(TiktokEventName.VIEW_CONTENT, {
      content_id: contentId,
      content_type: contentType,
      ...additionalParams,
    });
  }
  
  /**
   * Helper: Track a completed purchase
   * @param value The monetary value of the purchase
   * @param currency The currency code (e.g., USD)
   * @param contents The purchased items
   * @param additionalParams Additional event parameters
   */
  async trackCompletePurchase(
    value: number,
    currency: string,
    contents: Array<{
      content_id: string;
      content_type?: string;
      content_name?: string;
      quantity?: number;
      price?: number;
    }>,
    additionalParams: TiktokEventParams = {}
  ): Promise<boolean> {
    return this.trackEvent(TiktokEventName.COMPLETE_PAYMENT, {
      value,
      currency,
      contents,
      ...additionalParams,
    });
  }
  
  /**
   * Clean up resources when the module is no longer needed
   */
  cleanup(): void {
    if (this._appStateSubscription) {
      this._appStateSubscription.remove();
      this._appStateSubscription = null;
    }
  }
  
  /**
   * Set up app state listener for automatic event tracking
   */
  private _setupAppStateListener(): void {
    // Clean up existing listener if any
    if (this._appStateSubscription) {
      this._appStateSubscription.remove();
    }
    
    // Set up new listener
    this._appStateSubscription = AppState.addEventListener(
      'change',
      this._handleAppStateChange
    );
  }
  
  /**
   * Handle app state changes for automatic event tracking
   */
  private _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // App came to foreground - could track a custom event here if needed
      // We don't track Launch here as it's handled during initialization
    }
  };
}

// Export the singleton instance
export default new TiktokSDK();
