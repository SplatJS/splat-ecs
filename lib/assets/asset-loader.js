"use strict";

var loadAssets = require("./load-assets");

/**
 * Loads external assets, lets you track their progress, and lets you access the loaded data.
 * @constructor
 */
function AssetLoader(manifest, loader) {
  this.assets = loadAssets(manifest, loader, function(err) {
    if (err) {
      console.error(err);
    }
  });
}
AssetLoader.prototype.bytesLoaded = function() {
  return Object.keys(this.assets).reduce(function(accum, key) {
    var asset = this.assets[key];
    return accum + asset.loaded;
  }.bind(this), 0);
};
AssetLoader.prototype.totalBytes = function() {
  return Object.keys(this.assets).reduce(function(accum, key) {
    var asset = this.assets[key];
    return accum + asset.total;
  }.bind(this), 0);
};
/**
 * Retrieve a loaded asset.
 * @param {string} name The name given to the asset in the manifest.
 * @returns {object}
 */
AssetLoader.prototype.get = function(name) {
  var asset = this.assets[name];
  if (asset === undefined) {
    console.error("No such asset:", name);
    return undefined;
  }
  return asset.data;
};

module.exports = AssetLoader;
