"use strict";

module.exports = function(ecs) {
	ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
		if (entity.movement2d.up && entity.velocity.y > entity.movement2d.upMax) {
			entity.velocity.y += entity.movement2d.upAccel;
		}
		if (entity.movement2d.down && entity.velocity.y < entity.movement2d.downMax) {
			entity.velocity.y += entity.movement2d.downAccel;
		}
		if (entity.movement2d.left && entity.velocity.x > entity.movement2d.leftMax) {
			entity.velocity.x += entity.movement2d.leftAccel;
		}
		if (entity.movement2d.right && entity.velocity.x < entity.movement2d.rightMax) {
			entity.velocity.x += entity.movement2d.rightAccel;
		}
	}, ["velocity", "movement2d"]);
};
