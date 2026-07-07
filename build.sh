#!/bin/bash
set -e

echo "🏗️  Building Zen VOT Extension..."

# Clean old build
rm -rf build/
mkdir -p build

# Bundle JS with esbuild
echo "📦 Bundling JavaScript..."
npx esbuild src/content.js \
  --bundle \
  --outfile=build/content.js \
  --format=iife \
  --platform=browser \
  --minify

# Copy manifest
echo "📋 Copying manifest..."
cp manifest.json build/

# Copy icons
echo "🎨 Copying icons..."
cp icon.png build/
cp icon@2x.png build/
cp icon@3x.png build/

# Create ZIP for distribution
echo "🤐 Creating distribution ZIP..."
cd build
zip -r ../zen-vot-v1.0.0.zip .
cd ..

echo "✅ Build complete!"
echo ""
echo "📁 Build output: build/"
echo "📦 Distribution: zen-vot-v1.0.0.zip"
echo ""
echo "To install in Zen Browser:"
echo "1. Open about:debugging"
echo "2. Click 'This Firefox'"
echo "3. Click 'Load Temporary Add-on'"
echo "4. Select build/manifest.json"
