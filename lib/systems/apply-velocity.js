"use strict";

module.exports = function(ecs, game) {
	game.entities.registerSearch("applyVelocity", ["position", "velocity"]);
	ecs.addEach(function applyVelocity(entity, elapsed) {
		var position = game.entities.get(entity, "position");
		var velocity = game.entities.get(entity, "velocity");
		position.x += velocity.x * elapsed;
		position.y += velocity.y * elapsed;
	}, "applyVelocity");
};
