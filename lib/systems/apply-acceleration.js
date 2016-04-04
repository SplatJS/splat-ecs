"use strict";

module.exports = function(ecs, game) {
	game.entities.registerSearch("applyAcceleration", ["acceleration", "velocity"]);
	ecs.addEach(function applyAcceleration(entity, elapsed) {
		var velocity = game.entities.get(entity, "velocity");
		var acceleration = game.entities.get(entity, "acceleration");
		velocity.x += acceleration.x * elapsed;
		velocity.y += acceleration.y * elapsed;
	}, "applyAcceleration");
};
