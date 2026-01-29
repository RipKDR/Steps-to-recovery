// Metro configuration for Expo (CommonJS)
// Ensures .wasm assets (expo-sqlite web) are bundled correctly and supports monorepo paths.
const { resolve } = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const projectRoot = __dirname;
const monorepoRoot = resolve(projectRoot, '..', '..');
const config = getDefaultConfig(projectRoot);

// Allow importing files from the monorepo root (e.g., ../../index.ts) when bundling release.
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  resolve(projectRoot, 'node_modules'),
  resolve(monorepoRoot, 'node_modules'),
];

// Exclude reference/documentation folders from Metro bundler to prevent conflicts
config.resolver.blockList = [
  // Exclude reference screens (documentation only)
  new RegExp(`${monorepoRoot.replace(/\\/g, '\\\\')}\\\\_bmad-output.*`),
  // Exclude additions folder (feature proposals)
  new RegExp(`${monorepoRoot.replace(/\\/g, '\\\\')}\\\\additions.*`),
  // Exclude code-review folder
  new RegExp(`${monorepoRoot.replace(/\\/g, '\\\\')}\\\\code-review.*`),
  // Exclude SQL project
  new RegExp(`${monorepoRoot.replace(/\\/g, '\\\\')}\\\\steps-to-recovery.*`),
  // Exclude supabase folder
  new RegExp(`${monorepoRoot.replace(/\\/g, '\\\\')}\\\\supabase.*`),
];

// Treat wasm as an asset so Metro bundles the provided wa-sqlite.wasm
config.resolver.assetExts = [...config.resolver.assetExts, 'wasm'];
config.resolver.sourceExts = config.resolver.sourceExts.filter((ext) => ext !== 'wasm');

module.exports = withNativeWind(config, { input: './global.css' });
