package expo.modules.tiktokbusiness

import android.util.Log

// This class exists solely to match the class name Expo is looking for in its generated code
class TiktokSDK : TiktokSDKModule() {
  init {
    Log.i("TiktokSDK", "TiktokSDK instance created")
  }
  
  companion object {
    init {
      Log.i("TiktokSDK", "TiktokSDK class loaded")
    }
  }
} 