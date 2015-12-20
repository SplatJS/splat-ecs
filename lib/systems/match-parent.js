"use strict";

module.exports = function(ecs, data) {
	data.entities.registerSearch("matchParent", ["position", "match"]);
	ecs.addEach(function matchParent(entity, elapsed) { // eslint-disable-line no-unused-vars
		var match = data.entities.get(entity, "match");

		var parentPosition = data.entities.get(match.id, "position");
		if (parentPosition === undefined) {
			return;
		}

		data.entities.set(entity, "position", {
			x: parentPosition.x + match.offsetX,
			y: parentPosition.y + match.offsetY
		});
	}, "matchParent");
};
