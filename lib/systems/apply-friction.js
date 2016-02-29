"use strict";

module.exports = function(ecs, game) {
	game.entities.registerSearch("applyFriction", ["velocity", "friction"]);
	ecs.addEach(function applyFriction(entity, elapsed) { // eslint-disable-line no-unused-vars
		var velocity = game.entities.get(entity, "velocity");
		var friction = game.entities.get(entity, "friction");
		velocity.x *= friction.x;
		velocity.y *= friction.y;
	}, "applyFriction");
};
