"use strict";

module.exports = {
	moveToCamera: function(ecs, game) {
		game.entities.registerSearch("viewport", ["camera", "position", "size"]);
		ecs.addEach(function viewportMoveToCamera(entity, context) {
			var position = game.entities.get(entity, "position");
			var size = game.entities.get(entity, "size");

			context.save();
			context.scale(game.canvas.width / size.width, game.canvas.height / size.height);
			context.translate(-Math.floor(position.x), -Math.floor(position.y));
		}, "viewport");
	},
	reset: function viewportReset(ecs, game) { // eslint-disable-line no-unused-vars
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
			context.restore();
		}, "viewport");
	}
};
