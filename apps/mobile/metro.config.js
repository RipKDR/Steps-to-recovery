// Metro configuration for Expo (CommonJS)
// Ensures .wasm assets (expo-sqlite web) are bundled correctly and supports monorepo paths.
const { resolve } = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Allow importing files from the monorepo root (e.g., ../../index.ts) when bundling release.
config.watchFolders = [resolve(projectRoot, '..', '..')];
config.resolver.nodeModulesPaths = [
  resolve(projectRoot, 'node_modules'),
  resolve(projectRoot, '..', '..', 'node_modules'),
];

// Treat wasm as an asset so Metro bundles the provided wa-sqlite.wasm
config.resolver.assetExts = [...config.resolver.assetExts, 'wasm'];
config.resolver.sourceExts = config.resolver.sourceExts.filter((ext) => ext !== 'wasm');

module.exports = withNativeWind(config, { input: './global.css' });
