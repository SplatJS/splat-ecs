"use strict";

var loadAssets = require("./assets/load-assets");
var loadImage = require("./assets/load-image");

/**
 * Loads {@link external:image}s and lets you know when they're all available. An instance of ImageLoader is available as {@link Splat.Game#images}.
 * @constructor
 */
function ImageLoader(manifest) {
  /**
   * The key-value object that stores named {@link external:image}s
   * @member {object}
   * @private
   */
  this.images = loadAssets(manifest, loadImage, function(err) {
    if (err) {
      console.error(err);
    }
  }.bind(this));
}
ImageLoader.prototype.bytesLoaded = function() {
  return Object.keys(this.images).reduce(function(accum, key) {
    var image = this.images[key];
    return accum + image.loaded;
  }.bind(this), 0);
};
ImageLoader.prototype.totalBytes = function() {
  return Object.keys(this.images).reduce(function(accum, key) {
    var image = this.images[key];
    return accum + image.total;
  }.bind(this), 0);
};
/**
 * Retrieve a loaded {@link external:image}.
 * @param {string} name The name given to the image during {@link ImageLoader#load}.
 * @returns {external:image}
 */
ImageLoader.prototype.get = function(name) {
  var asset = this.images[name];
  if (asset === undefined) {
    console.error("No such asset:", name);
    return undefined;
  }
  return asset.data;
};

module.exports = ImageLoader;
