import { requireNativeView } from "expo";
import * as React from "react";

const NativeView: React.ComponentType<any> = requireNativeView("TiktokSDK");

export default function TiktokSDKView() {
  return <NativeView />;
}
