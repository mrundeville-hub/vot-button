#!/bin/sh
# Bundle Helium content script (vot.js needs a node:crypto stub — unused in browser)
cd "$(dirname "$0")/.." || exit 1
npx esbuild helium-build/content.src.js \
  --bundle \
  --outfile=helium-build/content.js \
  --format=iife \
  --platform=browser \
  --minify \
  --alias:node:crypto=./helium-build/crypto-stub.js
