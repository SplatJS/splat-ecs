"use strict";

module.exports = function(ecs, data) {
	data.entities.registerSearch("centerPosition", ["position", "center"]);
	ecs.addEach(function centerPosition(entity, elapsed) { // eslint-disable-line no-unused-vars
		var position = data.entities.get(entity, "position");
		var center = data.entities.get(entity, "center");
		var size = data.entities.get(entity, "size");
		// FIXME: doesn't work with cameras yet.
		if (center.x) {
			position.x = Math.floor(data.canvas.width / 2);
			if (size) {
				position.x -= Math.floor(size.width / 2);
			}
		}
		if (center.y) {
			position.y = Math.floor(data.canvas.height / 2);
			if (size) {
				position.y -= Math.floor(size.height / 2);
			}
		}
	}, "centerPosition");
};
