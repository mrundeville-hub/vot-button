#!/bin/sh
# One build, every browser: Chromium (Chrome/Edge/Brave/Opera/Vivaldi/Helium) and Gecko (Firefox/Zen/LibreWolf).
set -e
cd "$(dirname "$0")"

VERSION=$(node -p "require('./src/manifest.json').version")

rm -rf build
mkdir -p build

# vot.js pulls in node:crypto, unused in the browser
npx esbuild src/content.js \
  --bundle \
  --outfile=build/content.js \
  --format=iife \
  --platform=browser \
  --minify \
  --alias:node:crypto=./src/crypto-stub.js

cp src/manifest.json src/page.js src/background.js src/options.js src/options.html build/
cp -R src/icons build/

rm -f "vot-button-v$VERSION.zip"
(cd build && zip -qr "../vot-button-v$VERSION.zip" .)

echo "✅ build/ + vot-button-v$VERSION.zip"
echo "   Chromium: chrome://extensions → Developer mode → Load unpacked → build/"
echo "   Firefox:  about:debugging#/runtime/this-firefox → Load Temporary Add-on → build/manifest.json"
