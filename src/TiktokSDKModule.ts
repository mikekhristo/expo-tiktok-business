import { NativeModule, requireNativeModule } from "expo";

import { TiktokSDKModuleEvents } from "./TiktokSDK.types";

declare class TiktokSDKModule extends NativeModule<TiktokSDKModuleEvents> {
  initialize(appId: string, tiktokAppId: string): Promise<boolean>;
  trackEvent(
    eventName: string,
    eventData: Record<string, any>
  ): Promise<boolean>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<TiktokSDKModule>("TiktokSDK");
