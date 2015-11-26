"use strict";

var loadAssets = require("./load-assets");

module.exports = function(urls, callback) {
	return loadAssets(urls, function(err, assets) {
		if (err) {
			callback(err);
			return;
		}
		Object.keys(assets).forEach(function(key) {
			var asset = assets[key];

			var image = new Image();
			image.src = window.URL.createObjectURL(asset.data);
			asset.data = image;
		});
		callback(undefined, assets);
	});
};
