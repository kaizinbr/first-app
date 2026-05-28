require('graceful-fs').gracefulify(require('fs'));
const { gracefulify } = require('graceful-fs');
const fs = require('fs');
gracefulify(fs);

// patch no promises também
const fsp = require('fs/promises');
const { open: originalOpen, readFile: originalReadFile } = fsp;

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.maxWorkers = 2;

module.exports = config;