require("graceful-fs").gracefulify(require("fs"));

const path = require("path");
const fs = require("fs");
const os = require("os");

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const cacheDir = path.join(__dirname, ".metro-cache");

if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

config.fileMapCacheDirectory = cacheDir;
config.cacheStores = [];
config.maxWorkers =
    process.platform === "win32"
        ? 2
        : Math.max(1, Math.min(4, Math.floor(os.cpus().length / 2)));

const androidBuildBlockList =
    /^(?:android[\\/](?:.*[\\/])?build|android[\\/]\.gradle|ios[\\/]Pods)$/;

if (Array.isArray(config.resolver?.blockList)) {
    config.resolver.blockList = [
        ...config.resolver.blockList,
        androidBuildBlockList,
    ];
}

module.exports = config;
