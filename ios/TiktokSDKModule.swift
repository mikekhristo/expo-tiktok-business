import ExpoModulesCore
import TikTokBusinessSDK


public class TiktokSDKModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('TiktokSDK')` in JavaScript.
    Name("TiktokSDK")


    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("initialize") { (appId: String, tiktokAppId: String) in
      // Send an event to JavaScript.
      let config = TikTokConfig.init(appId: appId, tiktokAppId: tiktokAppId)
       TikTokBusiness.initializeSdk(config) { success, error in
            if (!success) { // initialization failed
                print(error!.localizedDescription)
            } else { // initialization successful
                print("Tiktok SDK initialized")
            }
        }
      
      return true
    }

    AsyncFunction("trackEvent") { (eventName: String, eventData: [String: Any]) in
      TikTokBusiness.trackEvent(eventName, withProperties: eventData)
      return true
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(TiktokSDKView.self) {
      // Defines a setter for the `url` prop.
      Prop("url") { (view: TiktokSDKView, url: URL) in
        if view.webView.url != url {
          view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }
}
