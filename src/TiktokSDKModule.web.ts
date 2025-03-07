import { registerWebModule, NativeModule } from "expo";
import { AppStateStatus, AppState, Platform } from "react-native";

import { 
  TiktokSDKModuleEvents, 
  TiktokEventName, 
  TiktokSDKConfig,
  TiktokEventParams,
  TiktokPlatformAppIds
} from "./TiktokSDK.types";

/**
 * Class that implements the TikTok Business SDK for web platforms.
 * This is a stub implementation for web platforms.
 */
class TiktokSDKModule extends NativeModule<TiktokSDKModuleEvents> {
  private _isInitialized: boolean = false;
  private _config?: TiktokSDKConfig;
  private _isDebugMode: boolean = false;
  
  /**
   * Initialize the TikTok Business SDK (web stub)
   * @param config SDK configuration
   */
  initialize(config: TiktokSDKConfig): Promise<boolean> {
    this._config = config;
    this._isDebugMode = config.debugMode || false;
    
    if (this._isDebugMode) {
      console.log('[TiktokSDK Web] Initialized with config:', config);
    }
    
    this._isInitialized = true;
    
    // Auto-track Launch event if enabled
    if (config.autoTrackAppLifecycle) {
      this._logEvent('Launch', {});
    }
    
    return Promise.resolve(true);
  }

  /**
   * Track a standard or custom event (web stub)
   * @param eventName Event name
   * @param eventData Event data
   */
  trackEvent(
    eventName: string,
    eventData: Record<string, any>
  ): Promise<boolean> {
    if (!this._isInitialized) {
      console.warn("[TiktokSDK Web] SDK not initialized. Call initialize() first.");
      return Promise.resolve(false);
    }
    
    this._logEvent(eventName, eventData);
    return Promise.resolve(true);
  }
  
  /**
   * Set debug mode (web stub)
   * @param enabled Whether to enable debug mode
   */
  setDebugMode(enabled: boolean): Promise<boolean> {
    this._isDebugMode = enabled;
    
    if (enabled) {
      console.log('[TiktokSDK Web] Debug mode enabled');
    }
    
    return Promise.resolve(true);
  }
  
  /**
   * Track route change (web stub)
   * @param routeName The name of the route/screen
   * @param params Optional route parameters
   */
  trackRouteChange(
    routeName: string, 
    params?: Record<string, any>
  ): Promise<boolean> {
    if (!this._isInitialized || !(this._config?.autoTrackRouteChanges)) {
      return Promise.resolve(false);
    }
    
    const eventData = {
      screen_name: routeName,
      ...(params ? { screen_params: params } : {})
    };
    
    this._logEvent('ViewContent', eventData);
    return Promise.resolve(true);
  }
  
  /**
   * Log events to console in debug mode
   * @param eventName The event name
   * @param eventData The event data
   */
  private _logEvent(eventName: string, eventData: Record<string, any>): void {
    if (this._isDebugMode) {
      console.log(
        `[TiktokSDK Web] Event: ${eventName}`, 
        eventData
      );
    }
  }
}

// Register the web module
export default registerWebModule(TiktokSDKModule);
