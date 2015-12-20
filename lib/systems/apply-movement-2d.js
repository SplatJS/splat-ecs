"use strict";

module.exports = function(ecs, data) {
	data.entities.registerSearch("applyMovement2d", ["velocity", "movement2d"]);
	ecs.addEach(function applyMovement2d(entity, elapsed) { // eslint-disable-line no-unused-vars
		var velocity = data.entities.get(entity, "velocity");
		var movement2d = data.entities.get(entity, "movement2d");
		if (movement2d.up && velocity.y > movement2d.upMax) {
			velocity.y += movement2d.upAccel;
		}
		if (movement2d.down && velocity.y < movement2d.downMax) {
			velocity.y += movement2d.downAccel;
		}
		if (movement2d.left && velocity.x > movement2d.leftMax) {
			velocity.x += movement2d.leftAccel;
		}
		if (movement2d.right && velocity.x < movement2d.rightMax) {
			velocity.x += movement2d.rightAccel;
		}
	}, "applyMovement2d");
};
