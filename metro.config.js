require('graceful-fs').gracefulify(require('fs'));

const path = require('path');
const fs = require('fs');

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const cacheDir = path.join(__dirname, '.metro-cache');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

config.fileMapCacheDirectory = cacheDir;

module.exports = config;