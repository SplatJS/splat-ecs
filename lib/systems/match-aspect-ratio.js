"use strict";

module.exports = function(ecs, data) {
	data.entities.registerSearch("matchAspectRatioSearch", ["matchAspectRatio", "size"]);
	ecs.addEach(function matchCanvasSize(entity, elapsed) { // eslint-disable-line no-unused-vars
		var size = data.entities.get(entity, "size");

		var match = data.entities.get(entity, "matchAspectRatio").id;
		var matchSize = data.entities.get(match, "size");
		if (matchSize === undefined) {
			return;
		}

		var matchAspectRatio = matchSize.width / matchSize.height;

		var currentAspectRatio = size.width / size.height;
		if (currentAspectRatio > matchAspectRatio) {
			size.height = Math.floor(size.width / matchAspectRatio);
		} else if (currentAspectRatio < matchAspectRatio) {
			size.width = Math.floor(size.height * matchAspectRatio);
		}
	}, "matchAspectRatioSearch");
};
