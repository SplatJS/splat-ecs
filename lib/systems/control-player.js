"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
		entity.movement2d.up = data.input.button(entity.playerController2d.up);
		entity.movement2d.down = data.input.button(entity.playerController2d.down);
		entity.movement2d.left = data.input.button(entity.playerController2d.left);
		entity.movement2d.right = data.input.button(entity.playerController2d.right);
	}, ["movement2d", "playerController2d"]);
};
