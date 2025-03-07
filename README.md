# expo-tiktok-business-sdk

An Expo module for the TikTok Business SDK that helps you track events and conversions in your Expo app. This module supports iOS, Android, and has stub implementation for web.

## Features

- 📱 Cross-platform support (iOS, Android, web)
- 🔍 Debug mode for development
- 🧩 Standard TikTok events defined as enums
- 🔄 Automatic app lifecycle tracking
- 🛣️ Expo Router integration for screen tracking
- 🛠️ Helper methods for common events

## Installation

### In managed Expo projects

```bash
npx expo install expo-tiktok-business-sdk
```

### In bare React Native projects

```bash
npm install expo-tiktok-business-sdk
```

#### Configure for iOS

```bash
npx pod-install
```

## Usage

### Initialize the SDK

```typescript
import TiktokSDK, { TiktokEventName } from 'expo-tiktok-business-sdk';

// In your app's entry point
useEffect(() => {
  // Basic initialization with same IDs for all platforms
  TiktokSDK.initialize(
    'com.yourcompany.yourapp', // Your app's bundle ID/package name
    'YOUR_TIKTOK_APP_ID',      // TikTok App ID from Business Center
    {
      debugMode: __DEV__,           // Enable debug mode in development
      autoTrackAppLifecycle: true,  // Automatically track app open/close
      autoTrackRouteChanges: true,  // Automatically track screen views
    }
  );
  
  // Clean up when your app unmounts
  return () => {
    TiktokSDK.cleanup();
  };
}, []);
```

#### Platform-specific initialization

TikTok often requires different App IDs for iOS and Android. You can provide platform-specific IDs:

```typescript
// With platform-specific app IDs and TikTok App IDs
TiktokSDK.initialize(
  {
    ios: 'com.yourcompany.yourapp',      // iOS bundle ID
    android: 'com.yourcompany.yourapp',  // Android package name
    default: 'com.yourcompany.yourapp'   // Fallback for other platforms
  },
  {
    ios: 'YOUR_IOS_TIKTOK_APP_ID',       // TikTok App ID for iOS
    android: 'YOUR_ANDROID_TIKTOK_APP_ID', // TikTok App ID for Android
    default: 'YOUR_DEFAULT_TIKTOK_APP_ID'  // Fallback for other platforms
  },
  {
    debugMode: __DEV__
  }
);
```

### Track Standard Events

```typescript
// Track a product view
TiktokSDK.trackEvent(TiktokEventName.VIEW_CONTENT, {
  content_id: 'product-123',
  content_type: 'product',
  content_category: 'electronics',
});

// Track a search
TiktokSDK.trackSearch('wireless headphones', {
  category: 'electronics',
});

// Track a purchase
TiktokSDK.trackCompletePurchase(
  99.99, // value
  'USD', // currency
  [
    {
      content_id: 'product-123',
      content_type: 'product',
      content_name: 'Wireless Headphones',
      quantity: 1,
      price: 99.99,
    }
  ],
  {
    order_id: 'ORDER-12345',
  }
);
```

### Expo Router Integration

```typescript
import { useTiktokRouteTracking } from 'expo-tiktok-business-sdk';

// In your app's root component
export default function App() {
  // This will initialize tracking for Expo Router
  useTiktokRouteTracking();
  
  return (
    <RootLayoutNav />
  );
}

// Alternatively, use the HOC
import { withTiktokRouteTracking } from 'expo-tiktok-business-sdk';

const MyComponent = () => <View>...</View>;
export default withTiktokRouteTracking(MyComponent);
```

For manual integration with Expo Router:

```typescript
import { usePathname, useSearchParams } from 'expo-router';
import { ExpoRouterIntegration } from 'expo-tiktok-business-sdk';

// In your app's root component
useEffect(() => {
  // Provide the Expo Router hooks directly
  ExpoRouterIntegration.setupWithRouter(usePathname, useSearchParams);
  
  return () => {
    ExpoRouterIntegration.cleanup();
  };
}, []);
```

## Debug Mode

Enable debug mode during development to see events in the console:

```typescript
// During initialization
TiktokSDK.initialize('YOUR_APP_ID', 'YOUR_TIKTOK_APP_ID', { debugMode: true });

// Or toggle it later
TiktokSDK.setDebugMode(true);
```

## Available Standard Events

The module includes all standard TikTok events as enums:

- `TiktokEventName.LAUNCH` - App launch
- `TiktokEventName.APP_INSTALL` - App installation
- `TiktokEventName.SEARCH` - User searched for content
- `TiktokEventName.VIEW_CONTENT` - User viewed content
- `TiktokEventName.CLICK` - User clicked on content
- `TiktokEventName.ADD_TO_WISHLIST` - User added item to wishlist
- `TiktokEventName.ADD_TO_CART` - User added item to cart
- `TiktokEventName.INITIATE_CHECKOUT` - User started checkout
- `TiktokEventName.ADD_PAYMENT_INFO` - User added payment info
- `TiktokEventName.COMPLETE_PAYMENT` - User completed payment
- `TiktokEventName.PLACE_AN_ORDER` - User placed an order
- `TiktokEventName.SUBSCRIBE` - User subscribed
- `TiktokEventName.CONTACT` - User initiated contact
- `TiktokEventName.CUSTOM` - Custom event

## License

MIT