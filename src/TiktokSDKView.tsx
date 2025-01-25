import { requireNativeView } from "expo";
import * as React from "react";

import { TiktokSDKViewProps } from "./TiktokSDK.types";

const NativeView: React.ComponentType<TiktokSDKViewProps> =
  requireNativeView("TiktokSDK");

export default function TiktokSDKView(props: TiktokSDKViewProps) {
  return <NativeView {...props} />;
}
