"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
		var parent = data.entities.entities[entity.match.id];
		if (parent === undefined) {
			return;
		}

		entity.position.x = parent.position.x + entity.match.offsetX;
		entity.position.y = parent.position.y + entity.match.offsetY;
	}, ["position", "match"]);
};
