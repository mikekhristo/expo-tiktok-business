/**
 * Standard TikTok event names
 */
export enum TiktokEventName {
  // App lifecycle events
  LAUNCH = "Launch",
  APP_INSTALL = "AppInstall",
  
  // Engagement events
  SEARCH = "Search",
  VIEW_CONTENT = "ViewContent",
  CLICK = "Click",
  ADD_TO_WISHLIST = "AddToWishlist",
  ADD_TO_CART = "AddToCart",
  
  // Conversion events
  INITIATE_CHECKOUT = "InitiateCheckout",
  ADD_PAYMENT_INFO = "AddPaymentInfo",
  COMPLETE_PAYMENT = "CompletePayment",
  PLACE_AN_ORDER = "PlaceAnOrder",
  SUBSCRIBE = "Subscribe",
  CONTACT = "Contact",
  
  // Custom event
  CUSTOM = "Custom"
}

/**
 * Platform-specific TikTok App IDs
 */
export interface TiktokPlatformAppIds {
  ios?: string;
  android?: string;
  default: string;
}

/**
 * Configuration for TikTok SDK initialization
 */
export interface TiktokSDKConfig {
  /**
   * Your app's bundle ID/package name.
   * Can be platform-specific or a single string for all platforms.
   * If not provided, it will attempt to use the Expo Constants.appOwnership or manifest.
   */
  appId: string | { ios?: string; android?: string; default: string };
  
  /**
   * TikTok App ID provided by TikTok Business Center.
   * Can be platform-specific or a single string for all platforms.
   */
  tiktokAppId: string | TiktokPlatformAppIds;
  
  /**
   * Enable debug mode for development
   */
  debugMode?: boolean;
  
  /**
   * Automatically track app lifecycle events (open, close)
   */
  autoTrackAppLifecycle?: boolean;
  
  /**
   * Automatically track route changes (screen views)
   */
  autoTrackRouteChanges?: boolean;
}

/**
 * Native module events interface
 */
export type TiktokSDKModuleEvents = {
  initialize: (
    config: TiktokSDKConfig
  ) => Promise<boolean>;
  
  trackEvent: (
    eventName: string,
    eventData: Record<string, any>
  ) => Promise<boolean>;
  
  setDebugMode: (
    enabled: boolean
  ) => Promise<boolean>;
};

/**
 * Event data for specific event types
 */
export interface TiktokEventParams {
  // Common fields for all events
  currency?: string;
  value?: number;
  description?: string;
  
  // ViewContent & Product events
  content_id?: string;
  content_type?: string;
  content_category?: string;
  
  // Search event
  search_string?: string;
  
  // Checkout events
  quantity?: number;
  contents?: Array<{
    content_id: string;
    content_type?: string;
    content_name?: string;
    quantity?: number;
    price?: number;
  }>;
  
  // Order events
  order_id?: string;
  
  // Additional custom parameters
  [key: string]: any;
}
