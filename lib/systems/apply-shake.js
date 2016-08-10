"use strict";

var random = require("../random");

/**
 * System that looks for an entity with the {@link Components.shake} and {@link Components.position} components.
 * Every frame the apply shake system will move the entity's position by a pseudo-random number of pixels between half the magnitude (positive and negative).
 * @memberof Systems
 * @alias applyShake
 * @requires Systems.revertShake
 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
 * @see [random]{@link splat-ecs/lib/random}
 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
 * @see [revertShake]{@link Systems.revertShake}
 */

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
	game.entities.registerSearch("applyShakeSearch",["shake", "position"]);
	ecs.addEach(function applyShake(entity, elapsed) { // eslint-disable-line no-unused-vars
		var shake = game.entities.get(entity, "shake");
		shake.duration -= elapsed;
		if (shake.duration <= 0) {
			game.entities.remove(entity, "shake");
			return;
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
