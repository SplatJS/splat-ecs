"use strict";

module.exports = function(ecs, data) {
	data.entities.registerSearch("controlPlayer", ["movement2d", "playerController2d"]);
	ecs.addEach(function controlPlayer(entity, elapsed) { // eslint-disable-line no-unused-vars
		var movement2d = data.entities.get(entity, "movement2d");
		var playerController2d = data.entities.get(entity, "playerController2d");
		movement2d.up = data.input.button(playerController2d.up);
		movement2d.down = data.input.button(playerController2d.down);
		movement2d.left = data.input.button(playerController2d.left);
		movement2d.right = data.input.button(playerController2d.right);
	}, "controlPlayer");
};
