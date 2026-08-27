#!/bin/sh
# Safari can't load an unpacked extension: it has to be wrapped in a signed app bundle.
# Needs Xcode. Output: safari/VOT Button.app
# ponytail: no --macos-only — в этом режиме конвертер игнорирует --bundle-identifier для
# app-таргета, и сборка падает на несовпадении префикса с расширением. iOS-таргет просто лежит рядом. — run it once, then enable in Safari settings.
set -e
cd "$(dirname "$0")"

./build.sh >/dev/null

rm -rf safari
xcrun safari-web-extension-converter build \
  --project-location safari \
  --app-name "VOT Button" \
  --bundle-identifier app.glamlabs.vot-button \
  --swift \
  --copy-resources \
  --no-open --no-prompt --force

# ponytail: ad-hoc signature (CODE_SIGN_IDENTITY=-) — needs "Allow Unsigned Extensions"
# in Safari's Develop menu. Swap in a real Developer ID team to ship it.
xcodebuild -quiet \
  -project "safari/VOT Button/VOT Button.xcodeproj" \
  -scheme "VOT Button (macOS)" \
  -configuration Release \
  -derivedDataPath safari/DerivedData \
  CODE_SIGN_IDENTITY=- CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM="" \
  build

cp -R "safari/DerivedData/Build/Products/Release/VOT Button.app" safari/

echo "✅ safari/VOT Button.app"
echo "   1. open 'safari/VOT Button.app'  (once — регистрирует расширение)"
echo "   2. Safari → Settings → Advanced → Show features for web developers"
echo "   3. Safari → Develop → Allow Unsigned Extensions"
echo "   4. Safari → Settings → Extensions → включить VOT Button → Always Allow on youtube.com"
