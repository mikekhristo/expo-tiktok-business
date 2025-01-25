import { registerWebModule, NativeModule } from 'expo';

import { TiktokSDKModuleEvents } from './TiktokSDK.types';

class TiktokSDKModule extends NativeModule<TiktokSDKModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(TiktokSDKModule);
