// Metro configuration for Expo (CommonJS)
// Ensures .wasm assets (expo-sqlite web) are bundled correctly.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Treat wasm as an asset so Metro bundles the provided wa-sqlite.wasm
config.resolver.assetExts = [...config.resolver.assetExts, 'wasm'];
config.resolver.sourceExts = config.resolver.sourceExts.filter((ext) => ext !== 'wasm');

module.exports = withNativeWind(config, { input: './global.css' });

