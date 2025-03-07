package expo.modules.tiktokbusinesssdk

import android.content.Context
import android.util.Log
import com.tiktok.TikTokBusinessSdk
import com.tiktok.TikTokBusinessSdk.TTConfig
import com.tiktok.appevents.TikTokAppEvent
import com.tiktok.appevents.TikTokAppEventsLogger
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class TiktokSDKModule : Module() {
  private var isInitialized = false
  private var autoTrackAppLifecycle = false
  private var autoTrackRouteChanges = false
  private lateinit var eventLogger: TikTokAppEventsLogger
  
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
        val ttConfig = TTConfig(
          context,
          appId,
          tiktokAppId,
          null,  // customUserAgent
          null,  // trackingUrl
          null,  // reportUrl
          debugMode // set debug mode
        )
        
        // Initialize the SDK
        TikTokBusinessSdk.initializeSdk(ttConfig)
        eventLogger = TikTokAppEventsLogger.newLogger(context)
        
        // Auto-track Launch event if enabled
        if (autoTrackAppLifecycle) {
          val launchEvent = TikTokAppEvent("Launch")
          eventLogger.logEvent(launchEvent)
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
        val event = TikTokAppEvent(eventName)
        
        // Add event properties if available
        eventData?.forEach { (key, value) ->
          when (value) {
            is String -> event.addProperty(key, value)
            is Int -> event.addProperty(key, value)
            is Long -> event.addProperty(key, value)
            is Float -> event.addProperty(key, value)
            is Double -> event.addProperty(key, value)
            is Boolean -> event.addProperty(key, value)
          }
        }
        
        // Log the event
        eventLogger.logEvent(event)
        return@AsyncFunction true
        
      } catch (e: Exception) {
        Log.e("TiktokSDK", "Error tracking event: ${e.message}")
        return@AsyncFunction false
      }
    }
    
    // Set debug mode
    AsyncFunction("setDebugMode") { enabled: Boolean ->
      TikTokBusinessSdk.setLogLevel(if (enabled) TikTokBusinessSdk.LogLevel.DEBUG else TikTokBusinessSdk.LogLevel.INFO)
      return@AsyncFunction true
    }
    
    // Track route change for Expo Router integration
    AsyncFunction("trackRouteChange") { routeName: String, params: Map<String, Any>? ->
      if (!isInitialized || !autoTrackRouteChanges) {
        return@AsyncFunction false
      }
      
      try {
        val event = TikTokAppEvent("ViewContent")
        event.addProperty("screen_name", routeName)
        
        // Add route params if available
        params?.let {
          event.addProperty("screen_params", it.toString())
        }
        
        eventLogger.logEvent(event)
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
