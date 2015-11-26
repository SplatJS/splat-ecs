"use strict";

var loadAssets = require("./load-assets");
var once = require("../once");

module.exports = function(urls, audioContext, callback) {
	callback = once(callback);

	return loadAssets(urls, function(err, assets) {
		if (err) {
			callback(err);
			return;
		}
		var decoded = 0;
		Object.keys(assets).forEach(function(key) {
			var asset = assets[key];

			// FIXME: this may not work with a Blob(), might have to convert to array buffer http://stackoverflow.com/a/15981017
			audioContext.decodeAudioData(asset.data, function(buffer) {
				decoded++;
				asset.data = buffer;
				if (decoded === urls.length) {
					callback(undefined, assets);
				}
			}, function(err) {
				callback(err);
			});
		});
	});
};
