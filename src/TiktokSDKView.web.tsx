import * as React from 'react';

import { TiktokSDKViewProps } from './TiktokSDK.types';

export default function TiktokSDKView(props: TiktokSDKViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
