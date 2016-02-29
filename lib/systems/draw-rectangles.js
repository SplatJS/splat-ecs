"use strict";

module.exports = function(ecs, game) {
	game.entities.registerSearch("drawRectangles", ["position", "size"]);
	ecs.addEach(function drawRectangles(entity, context) {
		var strokeStyle = game.entities.get(entity, "strokeStyle");
		if (strokeStyle) {
			context.strokeStyle = strokeStyle;
		}
		var position = game.entities.get(entity, "position");
		var size = game.entities.get(entity, "size");
		context.strokeRect(Math.floor(position.x), Math.floor(position.y), size.width, size.height);
	}, "drawRectangles");
};
