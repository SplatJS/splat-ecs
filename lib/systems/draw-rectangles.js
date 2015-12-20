"use strict";

module.exports = function(ecs, data) {
	data.entities.registerSearch("drawRectangles", ["position", "size"]);
	ecs.addEach(function drawRectangles(entity, context) {
		var strokeStyle = data.entities.get(entity, "strokeStyle");
		if (strokeStyle) {
			context.strokeStyle = strokeStyle;
		}
		var position = data.entities.get(entity, "position");
		var size = data.entities.get(entity, "size");
		context.strokeRect(Math.floor(position.x), Math.floor(position.y), size.width, size.height);
	}, "drawRectangles");
};
