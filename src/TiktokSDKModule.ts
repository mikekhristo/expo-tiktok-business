import { NativeModule, requireNativeModule } from "expo";

import { TiktokSDKModuleEvents } from "./TiktokSDK.types";

declare class TiktokSDKModule extends NativeModule<TiktokSDKModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<TiktokSDKModule>("TiktokSDK");
