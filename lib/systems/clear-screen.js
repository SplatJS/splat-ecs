"use strict";

module.exports = function(ecs, game) {
	ecs.add(function clearScreen() {
		game.context.clear(game.context.COLOR_BUFFER_BIT | game.context.DEPTH_BUFFER_BIT);
	});
};
