"use strict";

module.exports = function(ecs, game) {
	game.entities.registerSearch("matchCenterYSearch", ["matchCenterY", "size", "position"]);
	ecs.addEach(function matchCenter(entity, elapsed) { // eslint-disable-line no-unused-vars
		var position = game.entities.get(entity, "position");
		var size = game.entities.get(entity, "size");

		var matchY = game.entities.get(entity, "matchCenterY").id;
		var matchPosition = game.entities.get(matchY, "position");
		if (matchPosition === undefined) {
			return;
		}
		var matchSize = game.entities.get(matchY, "size");
		if (matchSize === undefined) {
			return;
		}

		position.y = matchPosition.y + (matchSize.width / 2) - (size.width / 2);
	}, "matchCenterYSearch");
};
