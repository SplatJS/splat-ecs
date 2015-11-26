"use strict";

var loadAsset = require("./load-asset");
var once = require("../once");

module.exports = function(urls, callback) {
	callback = once(callback);

	var finished = 0;
	return urls.reduce(function(assets, url) {
		assets[url] = loadAsset(url, function(err) {
			if (err) {
				callback(err);
				return;
			}
			finished++;
			if (finished === urls.length) {
				callback(undefined, assets);
			}
		});
		return assets;
	}, {});
};
