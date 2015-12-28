"use strict";

module.exports = function(ecs, game) {
	game.entities.registerSearch("constrainToPlayableArea", ["position", "size", "playableArea"]);
	ecs.addEach(function constrainToPlayableArea(entity, elapsed) { // eslint-disable-line no-unused-vars
		var position = game.entities.get(entity, "position");
		var playableArea = game.entities.get(entity, "playableArea");
		var size = game.entities.get(entity, "size");
		if (position.x < playableArea.x) {
			position.x = playableArea.x;
		}
		if (position.x + size.width > playableArea.x + playableArea.width) {
			position.x = playableArea.x + playableArea.width - size.width;
		}
		if (position.y < playableArea.y) {
			position.y = playableArea.y;
		}
		if (position.y + size.height > playableArea.y + playableArea.height) {
			position.y = playableArea.y + playableArea.height - size.height;
		}
	}, "constrainToPlayableArea");
};
