"use strict";

var random = require("../random");

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
	game.entities.registerSearch("applyShakeSearch",["shake", "position"]);
	ecs.addEach(function applyShake(entity, elapsed) { // eslint-disable-line no-unused-vars
		var shake = game.entities.get(entity, "shake");
		if (shake.duration !== undefined) {
			shake.duration -= elapsed;
			if (shake.duration <= 0) {
				game.entities.remove(entity, "shake");
				return;
			}
		}
		var position = game.entities.get(entity, "position");
		shake.lastPositionX = position.x;
		shake.lastPositionY = position.y;

		var mx = shake.magnitudeX;
		if (mx === undefined) {
			mx = shake.magnitude || 0;
		}
		mx /= 2;
		position.x += random.inRange(-mx, mx);

		var my = shake.magnitudeY;
		if (my === undefined) {
			my = shake.magnitude || 0;
		}
		my /= 2;
		position.y += random.inRange(-my, my);
	}, "applyShakeSearch");
};
