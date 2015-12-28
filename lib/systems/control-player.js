"use strict";

module.exports = function(ecs, game) {
	game.entities.registerSearch("controlPlayer", ["movement2d", "playerController2d"]);
	ecs.addEach(function controlPlayer(entity, elapsed) { // eslint-disable-line no-unused-vars
		var movement2d = game.entities.get(entity, "movement2d");
		var playerController2d = game.entities.get(entity, "playerController2d");
		movement2d.up = game.input.button(playerController2d.up);
		movement2d.down = game.input.button(playerController2d.down);
		movement2d.left = game.input.button(playerController2d.left);
		movement2d.right = game.input.button(playerController2d.right);
	}, "controlPlayer");
};
