"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function matchCanvasSize(entity, elapsed) { // eslint-disable-line no-unused-vars
		var size = data.entities.get(entity, "size");
		if (size === undefined) {
			data.entities.set(entity, "size", {
				width: data.canvas.width,
				height: data.canvas.height
			});
		} else {
			size.width = data.canvas.width;
			size.height = data.canvas.height;
		}
	}, "matchCanvasSize");
};
