"use strict";

module.exports = function(ecs, data) {
	data.entities.registerSearch("applyVelocity", ["position", "velocity"]);
	ecs.addEach(function applyVelocity(entity, elapsed) {
		var position = data.entities.get(entity, "position");
		var velocity = data.entities.get(entity, "velocity");
		position.x += velocity.x * elapsed;
		position.y += velocity.y * elapsed;
	}, "applyVelocity");
};
