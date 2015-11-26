"use strict";

var loadAssets = require("./load-assets");

module.exports = function(urls, callback) {
	return loadAssets(urls, function(err, assets) {
		if (err) {
			callback(err);
			return;
		}
		var images = Object.keys(assets).reduce(function(images, key) {
			var asset = assets[key];

			var image = new Image();
			image.src = window.URL.createObjectURL(asset);
			images[key] = image;

			return images;
		}, {});
		callback(undefined, images);
	});
};
