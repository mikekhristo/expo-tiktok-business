#!/bin/bash

# This script helps install the module locally for testing
# Usage: ./install-local.sh /path/to/your/test-app

if [ $# -eq 0 ]; then
  echo "Please provide the path to your test app."
  echo "Usage: ./install-local.sh /path/to/your/test-app"
  exit 1
fi

TEST_APP_PATH=$1

# Ensure the build is up to date
echo "Building expo-tiktok-business-sdk..."
npm run build

# Create a tarball of the module
echo "Creating module tarball..."
npm pack

# Get the name of the generated tarball
TARBALL=$(ls expo-tiktok-business-sdk-*.tgz | tail -n 1)

if [ -z "$TARBALL" ]; then
  echo "Error: Failed to create tarball."
  exit 1
fi

# Install the tarball in the test app
echo "Installing module in test app at $TEST_APP_PATH..."
npm_command="npm install $(pwd)/$TARBALL"

cd "$TEST_APP_PATH" && eval $npm_command

if [ $? -eq 0 ]; then
  echo "Success! The module has been installed locally."
  echo ""
  echo "For iOS, run 'npx pod-install' to complete the installation."
  echo "For Android, make sure to rebuild the app."
  echo ""
  echo "Example usage in your app:"
  echo ""
  echo "import TiktokSDK, { TiktokEventName } from 'expo-tiktok-business-sdk';"
  echo ""
  echo "// Initialize the SDK"
  echo "TiktokSDK.initialize('YOUR_APP_ID', 'YOUR_TIKTOK_APP_ID', {"
  echo "  debugMode: true,"
  echo "  autoTrackAppLifecycle: true,"
  echo "});"
  echo ""
  echo "// Track an event"
  echo "TiktokSDK.trackEvent(TiktokEventName.VIEW_CONTENT, {"
  echo "  content_id: 'product-123'"
  echo "});"
else
  echo "Error: Failed to install the module in the test app."
  exit 1
fi