import { registerWebModule, NativeModule } from "expo";

import { TiktokSDKModuleEvents } from "./TiktokSDK.types";

class TiktokSDKModule extends NativeModule<TiktokSDKModuleEvents> {
  initialize(appId: string, tiktokAppId: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  trackEvent(
    eventName: string,
    eventData: Record<string, any>
  ): Promise<boolean> {
    return Promise.resolve(false);
  }
}

export default registerWebModule(TiktokSDKModule);
