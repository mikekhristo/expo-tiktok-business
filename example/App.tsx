import TiktokSDK, { TiktokEventName, useTiktokRouteTracking } from "expo-tiktok-business-sdk";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View, Button, StyleSheet } from "react-native";

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  // Enable Expo Router tracking
  useTiktokRouteTracking();

  // Initialize TikTok SDK
  useEffect(() => {
    async function initSDK() {
      try {
        // Using platform-specific app IDs and TikTok App IDs
        // Replace with your actual app IDs in a real app
        const success = await TiktokSDK.initialize(
          {
            ios: "com.yourcompany.yourapp",     // iOS bundle ID
            android: "com.yourcompany.yourapp", // Android package name
            default: "com.yourcompany.yourapp"  // Fallback
          },
          {
            ios: "your-ios-tiktok-app-id",      // TikTok App ID for iOS
            android: "your-android-tiktok-app-id", // TikTok App ID for Android
            default: "your-default-tiktok-app-id"  // Fallback
          },
          {
            debugMode: true, // Enable debug mode for development
            autoTrackAppLifecycle: true,
            autoTrackRouteChanges: true,
          }
        );
        
        setIsInitialized(success);
        console.log("TikTok SDK initialized:", success);
      } catch (error) {
        console.error("Failed to initialize TikTok SDK:", error);
      }
    }
    
    initSDK();
    
    // Clean up when component unmounts
    return () => {
      TiktokSDK.cleanup();
    };
  }, []);

  // Event tracking handlers
  const trackViewContent = async () => {
    const eventName = TiktokEventName.VIEW_CONTENT;
    const success = await TiktokSDK.trackEvent(eventName, {
      content_id: "product-123",
      content_type: "product",
      content_category: "electronics",
    });
    
    setLastEvent(`${eventName} (success: ${success})`);
  };

  const trackAddToCart = async () => {
    const eventName = TiktokEventName.ADD_TO_CART;
    const success = await TiktokSDK.trackEvent(eventName, {
      content_id: "product-123",
      content_type: "product",
      value: 99.99,
      currency: "USD",
      quantity: 1,
    });
    
    setLastEvent(`${eventName} (success: ${success})`);
  };

  const trackCustomEvent = async () => {
    const eventName = "CustomAction";
    const success = await TiktokSDK.trackEvent(eventName, {
      action_type: "button_click",
      screen: "home",
      element_id: "featured_product",
    });
    
    setLastEvent(`${eventName} (success: ${success})`);
  };

  const trackSearch = async () => {
    const success = await TiktokSDK.trackSearch("wireless headphones", {
      category: "electronics",
    });
    
    setLastEvent(`${TiktokEventName.SEARCH} (success: ${success})`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.header}>TikTok Business SDK Example</Text>
        
        <Group name="SDK Status">
          <Text style={styles.text}>
            Initialized: <Text style={styles.highlight}>{isInitialized ? "Yes" : "No"}</Text>
          </Text>
          {lastEvent && (
            <Text style={styles.text}>
              Last Event: <Text style={styles.highlight}>{lastEvent}</Text>
            </Text>
          )}
        </Group>
        
        <Group name="Standard Events">
          <View style={styles.buttonContainer}>
            <Button 
              title="Track View Content" 
              onPress={trackViewContent} 
              disabled={!isInitialized} 
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Track Add to Cart" 
              onPress={trackAddToCart} 
              disabled={!isInitialized} 
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Track Search" 
              onPress={trackSearch} 
              disabled={!isInitialized} 
            />
          </View>
        </Group>
        
        <Group name="Custom Events">
          <View style={styles.buttonContainer}>
            <Button 
              title="Track Custom Event" 
              onPress={trackCustomEvent} 
              disabled={!isInitialized} 
            />
          </View>
        </Group>
        
        <Group name="Debug Info">
          <Text style={styles.text}>
            Debug Mode: <Text style={styles.highlight}>Enabled</Text>
          </Text>
          <Text style={styles.text}>
            Platform: <Text style={styles.highlight}>{Platform.OS}</Text>
          </Text>
          <Text style={styles.text}>
            See logs in console for detailed event information
          </Text>
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

// Import Platform from react-native for platform detection
import { Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
    textAlign: "center",
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  group: {
    margin: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
    color: "#444",
  },
  highlight: {
    fontWeight: "bold",
    color: "#007bff",
  },
});
