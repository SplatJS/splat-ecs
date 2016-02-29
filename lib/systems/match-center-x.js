"use strict";

module.exports = function(ecs, game) {
	game.entities.registerSearch("matchCenterXSearch", ["matchCenterX", "size", "position"]);
	ecs.addEach(function matchCenter(entity, elapsed) { // eslint-disable-line no-unused-vars
		var position = game.entities.get(entity, "position");
		var size = game.entities.get(entity, "size");

		var matchX = game.entities.get(entity, "matchCenterX").id;
		var matchPosition = game.entities.get(matchX, "position");
		if (matchPosition === undefined) {
			return;
		}
		var matchSize = game.entities.get(matchX, "size");
		if (matchSize === undefined) {
			return;
		}

		position.x = matchPosition.x + (matchSize.width / 2) - (size.width / 2);
	}, "matchCenterXSearch");
};
