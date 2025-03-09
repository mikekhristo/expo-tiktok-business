import ExpoModulesCore
import TikTokBusinessSDK

public class TiktokSDKModule: Module {
  private var isInitialized = false
  private var autoTrackAppLifecycle = false
  private var autoTrackRouteChanges = false
  
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module.
    // The module will be accessible from `requireNativeModule('TiktokSDK')` in JavaScript.
    Name("TiktokSDK")

    // Initialize TikTok Business SDK with configuration
    AsyncFunction("initialize") { (configDict: [String: Any]) in
      guard let appId = configDict["appId"] as? String,
            let tiktokAppId = configDict["tiktokAppId"] as? String else {
        print("Error: TikTok SDK requires appId and tiktokAppId")
        return false
      }
      
      // Create config
      let config = TikTokConfig.init(appId: appId, tiktokAppId: tiktokAppId)
      
      // Set debug mode if specified
      if let debugMode = configDict["debugMode"] as? Bool, debugMode {
        // Safely unwrap the optional config before calling methods
        config?.enableDebugMode()
        // Note: Not setting log level as we don't know the correct enum values
        // and enableDebugMode() should be sufficient
      }
      
      // Store auto-tracking preferences
      if let autoTrackAppLifecycle = configDict["autoTrackAppLifecycle"] as? Bool {
        self.autoTrackAppLifecycle = autoTrackAppLifecycle
      }
      
      if let autoTrackRouteChanges = configDict["autoTrackRouteChanges"] as? Bool {
        self.autoTrackRouteChanges = autoTrackRouteChanges
      }
      
      // Initialize the SDK - safely unwrap config
      if let unwrappedConfig = config {
        TikTokBusiness.initializeSdk(unwrappedConfig) { success, error in
          if (!success) {
            print("TikTok SDK initialization failed: \(error?.localizedDescription ?? "Unknown error")")
          } else {
            print("TikTok SDK initialized successfully")
            
            // Auto-track Launch event if enabled
            if self.autoTrackAppLifecycle {
              TikTokBusiness.trackEvent("Launch")
            }
            
            self.isInitialized = true
          }
        }
      } else {
        print("Error: TikTok SDK initialization failed - config is nil")
        return false
      }
      
      return true
    }

    // Track standard or custom events
    AsyncFunction("trackEvent") { (eventName: String, eventData: [String: Any]) in
      guard self.isInitialized else {
        print("Warning: TikTok SDK not initialized. Call initialize() first.")
        return false
      }
      
      TikTokBusiness.trackEvent(eventName, withProperties: eventData)
      return true
    }
    
    // Set debug mode
    AsyncFunction("setDebugMode") { (enabled: Bool) in
      // Note: Debug mode can only be set during initialization in the iOS SDK
      // We'll keep this function for API compatibility with the JS interface
      // but log a warning about its limitations
      print("TikTok SDK iOS: Debug mode can only be set during initialization. This call has no effect.")
      return true
    }
    
    // Track route change for Expo Router integration
    // This method is called from JS when a route changes
    AsyncFunction("trackRouteChange") { (routeName: String, params: [String: Any]?) in
      guard self.isInitialized && self.autoTrackRouteChanges else {
        return false
      }
      
      var properties: [String: Any] = ["screen_name": routeName]
      
      // Add route params if available
      if let params = params {
        properties["screen_params"] = params
      }
      
      TikTokBusiness.trackEvent("ViewContent", withProperties: properties)
      return true
    }

    // Enables the module to be used as a native view
    View(TiktokSDKView.self) {
      // Defines a setter for the `url` prop
      Prop("url") { (view: TiktokSDKView, url: URL) in
        if view.webView.url != url {
          view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }
}
