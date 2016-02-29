"use strict";

module.exports = function(ecs, game) {
	game.entities.registerSearch("controlPlayer", ["movement2d", "playerController2d"]);
	ecs.addEach(function controlPlayer(entity, elapsed) { // eslint-disable-line no-unused-vars
		var movement2d = game.entities.get(entity, "movement2d");
		var playerController2d = game.entities.get(entity, "playerController2d");
		movement2d.up = game.inputs.button(playerController2d.up);
		movement2d.down = game.inputs.button(playerController2d.down);
		movement2d.left = game.inputs.button(playerController2d.left);
		movement2d.right = game.inputs.button(playerController2d.right);
	}, "controlPlayer");
};
