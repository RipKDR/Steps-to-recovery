// Metro configuration for Expo (ES Module)
// Ensures .wasm assets (expo-sqlite web) are bundled correctly.
import path from 'path';
import { fileURLToPath } from 'url';
import { getDefaultConfig } from 'expo/metro-config';
import { withNativeWind } from 'nativewind/metro';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = getDefaultConfig(__dirname);

// Allow importing files from the monorepo root (e.g., ../../index.ts) when bundling release.
config.watchFolders = [path.resolve(__dirname, '..', '..')];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '..', '..', 'node_modules'),
];

// Treat wasm as an asset so Metro bundles the provided wa-sqlite.wasm
config.resolver.assetExts = [...config.resolver.assetExts, 'wasm'];
config.resolver.sourceExts = config.resolver.sourceExts.filter((ext) => ext !== 'wasm');

export default withNativeWind(config, { input: './global.css' });
