"use strict";

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
	game.entities.registerSearch("revertShakeSearch",["shake", "position"]);
	ecs.addEach(function revertShake(entity, elapsed) { // eslint-disable-line no-unused-vars
		var shake = game.entities.get(entity, "shake");
		var position = game.entities.get(entity, "position");
		position.x = shake.lastPositionX;
		position.y = shake.lastPositionY;
	}, "revertShakeSearch");
};
