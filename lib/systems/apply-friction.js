"use strict";

module.exports = function(ecs, data) {
	data.entities.registerSearch("applyFriction", ["velocity", "friction"]);
	ecs.addEach(function applyFriction(entity, elapsed) { // eslint-disable-line no-unused-vars
		var velocity = data.entities.get(entity, "velocity");
		var friction = data.entities.get(entity, "friction");
		velocity.x *= friction.x;
		velocity.y *= friction.y;
	}, "applyFriction");
};
