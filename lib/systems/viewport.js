"use strict";

module.exports = {
	moveToCamera: function(ecs, data) {
		data.entities.registerSearch("viewport", ["camera", "position", "size"]);
		ecs.addEach(function(entity, context) {
			var position = data.entities.get(entity, "position");
			var size = data.entities.get(entity, "size");

			context.save();
			context.scale(data.canvas.width / size.width, data.canvas.height / size.height);
			context.translate(-Math.floor(position.x), -Math.floor(position.y));
		}, "viewport");
	},
	reset: function(ecs, data) { // eslint-disable-line no-unused-vars
		ecs.addEach(function(entity, context) { // eslint-disable-line no-unused-vars
			context.restore();
		}, "viewport");
	}
};
