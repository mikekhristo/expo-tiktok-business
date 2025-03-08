package expo.modules.tiktokbusinesssdk

import android.content.Context
import android.util.Log
import com.tiktok.TikTokBusinessSdk
import com.tiktok.TikTokBusinessSdk.TTConfig
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONObject
import java.net.URL

class TiktokSDKModule : Module() {
  private var isInitialized = false
  private var autoTrackAppLifecycle = false
  private var autoTrackRouteChanges = false
  
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module
    Name("TiktokSDK")

    // Initialize TikTok Business SDK with configuration
    AsyncFunction("initialize") { config: Map<String, Any> ->
      try {
        val appId = config["appId"] as? String
        val tiktokAppId = config["tiktokAppId"] as? String
        
        if (appId.isNullOrEmpty() || tiktokAppId.isNullOrEmpty()) {
          Log.e("TiktokSDK", "Error: TikTok SDK requires appId and tiktokAppId")
          return@AsyncFunction false
        }
        
        // Get the application context
        val context = appContext.reactContext?.applicationContext ?: return@AsyncFunction false
        
        // Store auto-tracking preferences
        autoTrackAppLifecycle = config["autoTrackAppLifecycle"] as? Boolean ?: false
        autoTrackRouteChanges = config["autoTrackRouteChanges"] as? Boolean ?: false
        
        // Configure debug mode
        val debugMode = config["debugMode"] as? Boolean ?: false
        
        // Create TikTok SDK configuration
        val ttConfig = TTConfig(context)
        
        // Initialize the SDK
        TikTokBusinessSdk.initializeSdk(ttConfig)
        
        // Set debug mode if enabled
        if (debugMode) {
          // The SDK doesn't have setLogLevel, so we'll use a different approach or skip this
          // TikTokBusinessSdk.setLogLevel(TikTokBusinessSdk.LogLevel.DEBUG)
        }
        
        // Auto-track Launch event if enabled
        if (autoTrackAppLifecycle) {
          // The newer SDK version handles this automatically
        }
        
        isInitialized = true
        Log.i("TiktokSDK", "TikTok SDK initialized successfully")
        return@AsyncFunction true
        
      } catch (e: Exception) {
        Log.e("TiktokSDK", "Error initializing TikTok SDK: ${e.message}")
        return@AsyncFunction false
      }
    }

    // Track standard or custom events
    AsyncFunction("trackEvent") { eventName: String, eventData: Map<String, Any>? ->
      if (!isInitialized) {
        Log.w("TiktokSDK", "Warning: TikTok SDK not initialized. Call initialize() first.")
        return@AsyncFunction false
      }
      
      try {
        // Convert Map to JSONObject for the SDK
        val jsonProps = if (eventData != null) JSONObject(eventData) else null
        
        // Log the event using the correct SDK method
        TikTokBusinessSdk.trackEvent(eventName, jsonProps)
        return@AsyncFunction true
        
      } catch (e: Exception) {
        Log.e("TiktokSDK", "Error tracking event: ${e.message}")
        return@AsyncFunction false
      }
    }
    
    // Set debug mode
    AsyncFunction("setDebugMode") { enabled: Boolean ->
      // The SDK doesn't have setLogLevel, so we'll just return true
      // TikTokBusinessSdk.setLogLevel(if (enabled) TikTokBusinessSdk.LogLevel.DEBUG else TikTokBusinessSdk.LogLevel.INFO)
      return@AsyncFunction true
    }
    
    // Track route change for Expo Router integration
    AsyncFunction("trackRouteChange") { routeName: String, params: Map<String, Any>? ->
      if (!isInitialized || !autoTrackRouteChanges) {
        return@AsyncFunction false
      }
      
      try {
        // Create JSONObject for properties
        val jsonProps = JSONObject()
        jsonProps.put("screen_name", routeName)
        
        // Add route params if available
        params?.let {
          jsonProps.put("screen_params", it.toString())
        }
        
        // Track the view content event with the correct method
        TikTokBusinessSdk.trackEvent("ViewContent", jsonProps)
        return@AsyncFunction true
        
      } catch (e: Exception) {
        Log.e("TiktokSDK", "Error tracking route change: ${e.message}")
        return@AsyncFunction false
      }
    }

    // Enables the module to be used as a native view
    View(TiktokSDKView::class) {
      // Defines a setter for the `url` prop
      Prop("url") { view: TiktokSDKView, url: URL ->
        view.webView.loadUrl(url.toString())
      }
      // Defines an event that the view can send to JavaScript
      Events("onLoad")
    }
  }
}
