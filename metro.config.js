// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add support for static files (optional)
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

// Enable require.context
config.resolver.enableModuleResolution = true;

module.exports = withNativeWind(config, { input: "./global.css" });