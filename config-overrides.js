const path = require('path-browserify');
const os = require('os-browserify');

module.exports = function override(config) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        path: path,
        os: os,
    };
    return config;
};