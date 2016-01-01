"use strict";

module.exports = function(ecs, game) {
	game.entities.registerSearch("showHitBoxes", ["showHitBox", "size", "position", "collisions"]);
	ecs.addEach(function drawRectangles(entity, context) {
		if (game.entities.get(entity, "showHitBoxes")) {
			context.strokeStyle = "white";
			if (game.entities.get(entity, "collisions").length > 0) {
				context.strokeStyle = "red";
			}
			var position = game.entities.get(entity, "position");
			var size = game.entities.get(entity, "size");
			context.strokeRect(Math.floor(position.x), Math.floor(position.y), size.width, size.height);
		}
	}, "showHitBoxes");
};
