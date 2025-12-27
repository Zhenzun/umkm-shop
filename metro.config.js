const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Hubungkan dengan file global.css Anda
module.exports = withNativeWind(config, { input: "./global.css" });