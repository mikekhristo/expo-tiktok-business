export type TiktokSDKModuleEvents = {
  initialize: (appId: string, tiktokAppId: string) => Promise<boolean>;
  trackEvent: (
    eventName: string,
    eventData: Record<string, any>
  ) => Promise<boolean>;
};
