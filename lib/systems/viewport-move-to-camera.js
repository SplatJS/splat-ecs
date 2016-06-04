"use strict";

module.exports = function(ecs, game) {
	game.entities.registerSearch("viewport", ["camera", "position", "size"]);
	ecs.addEach(function viewportMoveToCamera(entity, elapsed) { // eslint-disable-line no-unused-vars
		var position = game.entities.get(entity, "position");
		var size = game.entities.get(entity, "size");

		game.context.save();
		game.context.scale(game.canvas.width / size.width, game.canvas.height / size.height);
		game.context.translate(-Math.floor(position.x), -Math.floor(position.y));
	}, "viewport");
};
