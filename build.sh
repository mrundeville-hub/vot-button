#!/bin/bash
set -e

echo "🏗️  Building VOT Button extension..."

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
zip -r ../vot-button-v1.0.0.zip .
cd ..

echo "✅ Build complete!"
echo ""
echo "📁 Build output: build/"
echo "📦 Distribution: vot-button-v1.0.0.zip"
echo ""
echo "Install in Zen / Firefox:"
echo "  about:debugging → This Firefox → Load Temporary Add-on → build/manifest.json"
echo ""
echo "Install in Helium / Chrome / any Chromium:"
echo "  chrome://extensions → Developer mode → Load unpacked → build/"
