package expo.modules.tiktokbusiness

import android.content.Context
import android.util.Log
import com.tiktok.TikTokBusinessSdk
import com.tiktok.TikTokBusinessSdk.TTConfig
import com.tiktok.TikTokBusinessSdk.LogLevel
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONObject
import java.net.URL

open class TiktokSDKModule : Module() {
  private var isInitialized = false
  private var autoTrackAppLifecycle = false
  private var autoTrackRouteChanges = false
  
  override fun definition() = ModuleDefinition {
    Log.i("TiktokSDKModule", "definition() called - starting module registration")
    // Sets the name of the module that JavaScript code will use to refer to the module
    Name("TiktokSDK")
    Log.i("TiktokSDKModule", "Module name set to TiktokSDK")

    // Log individual AsyncFunction registration for thorough traceability
    Log.i("TiktokSDKModule", "Registering async function: initialize")
    AsyncFunction("initialize") { config: Map<String, Any> ->
      Log.i("TiktokSDKModule", "AsyncFunction initialize called with config: $config")
      try {
        val appId = config["appId"] as? String
        val tiktokAppId = config["tiktokAppId"] as? String
        
        if (appId.isNullOrEmpty() || tiktokAppId.isNullOrEmpty()) {
          Log.e("TiktokSDK", "Error: TikTok SDK requires appId and tiktokAppId")
          return@AsyncFunction false
        }
        
        // Get the application context
        val context = appContext.reactContext?.applicationContext
        if (context == null) {
          Log.e("TiktokSDK", "Error: Application context is null")
          return@AsyncFunction false
        } else {
          Log.i("TiktokSDK", "Application context obtained successfully")
        }
        
        // Store auto-tracking preferences
        autoTrackAppLifecycle = config["autoTrackAppLifecycle"] as? Boolean ?: false
        autoTrackRouteChanges = config["autoTrackRouteChanges"] as? Boolean ?: false
        
        // Configure debug mode
        val debugMode = config["debugMode"] as? Boolean ?: false
        Log.i("TiktokSDK", "Debug mode: $debugMode")
        
        Log.i("TiktokSDK", "Initializing for android with appId=$appId, tiktokAppId=$tiktokAppId")
        
        try {
            // Create TikTok SDK configuration with all required parameters
            val ttConfig = TTConfig(context)
            
            // Set app ID
            Log.d("TiktokSDK", "Setting appId: $appId")
            ttConfig.setAppId(appId)
            
            // Set TikTok app ID
            Log.d("TiktokSDK", "Setting tiktokAppId: $tiktokAppId")
            ttConfig.setTTAppId(tiktokAppId)
            
            // Set debug mode if enabled
            if (debugMode) {
                Log.d("TiktokSDK", "Setting debug mode")
                ttConfig.setLogLevel(LogLevel.DEBUG)
            }
            
            // Initialize the SDK
            Log.d("TiktokSDK", "Calling TikTokBusinessSdk.initializeSdk")
            TikTokBusinessSdk.initializeSdk(ttConfig)
            
            Log.i("TiktokSDK", "SDK initialized successfully")
        } catch (e: Exception) {
            Log.e("TiktokSDK", "Error during TTConfig setup: ${e.message}")
            e.printStackTrace()
            return@AsyncFunction false
        }
        
        if (autoTrackAppLifecycle) {
            Log.d("TiktokSDK", "Auto-tracking app lifecycle enabled")
        }
        
        isInitialized = true
        Log.i("TiktokSDK", "TikTok SDK initialization complete")
        return@AsyncFunction true
        
      } catch (e: Exception) {
        Log.e("TiktokSDK", "Error initializing TikTok SDK: ${e.message}")
        e.printStackTrace()
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
        
        Log.d("TiktokSDK", "Tracking event: $eventName with props: $jsonProps")
        
        // Log the event using the correct SDK method
        TikTokBusinessSdk.trackEvent(eventName, jsonProps)
        return@AsyncFunction true
        
      } catch (e: Exception) {
        Log.e("TiktokSDK", "Error tracking event: ${e.message}")
        e.printStackTrace()
        return@AsyncFunction false
      }
    }
    
    // Set debug mode
    AsyncFunction("setDebugMode") { enabled: Boolean ->
      // We can't set log level after initialization, so we'll just return true
      Log.i("TiktokSDK", "setDebugMode called with enabled=$enabled (no-op after initialization)")
      return@AsyncFunction true
    }
    
    // Track route change for Expo Router integration
    AsyncFunction("trackRouteChange") { routeName: String, params: Map<String, Any>? ->
      if (!isInitialized || !autoTrackRouteChanges) {
        if (!isInitialized) {
          Log.w("TiktokSDK", "trackRouteChange: SDK not initialized")
        } else {
          Log.d("TiktokSDK", "trackRouteChange: auto tracking disabled")
        }
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
        
        Log.d("TiktokSDK", "Tracking route change to: $routeName with params: $jsonProps")
        
        // Track the view content event with the correct method
        TikTokBusinessSdk.trackEvent("ViewContent", jsonProps)
        return@AsyncFunction true
        
      } catch (e: Exception) {
        Log.e("TiktokSDK", "Error tracking route change: ${e.message}")
        e.printStackTrace()
        return@AsyncFunction false
      }
    }

    // View registration logging
    Log.i("TiktokSDKModule", "Registering native view: TiktokSDKView")
    View(TiktokSDKView::class) {
      Prop("url") { view: TiktokSDKView, url: URL ->
        Log.d("TiktokSDKModule", "Setting URL in native view: $url")
        view.webView.loadUrl(url.toString())
      }
      Events("onLoad")
    }
    
    Log.i("TiktokSDKModule", "Module registration complete")
  }
}
