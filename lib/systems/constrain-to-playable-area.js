"use strict";

module.exports = function(ecs, data) {
	data.entities.registerSearch("constrainToPlayableArea", ["position", "size", "playableArea"]);
	ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
		var position = data.entities.get(entity, "position");
		var playableArea = data.entities.get(entity, "playableArea");
		var size = data.entities.get(entity, "size");
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
