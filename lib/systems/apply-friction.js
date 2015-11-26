"use strict";

module.exports = function(ecs) {
	ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
		entity.velocity.x *= entity.friction.x;
		entity.velocity.y *= entity.friction.y;
	}, ["velocity", "friction"]);
};
