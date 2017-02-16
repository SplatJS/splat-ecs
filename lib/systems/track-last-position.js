"use strict";

/**
* System that looks for an entity with the {@link Components.collisions}, {@link Components.position}, and {@link Components.size} components.
* Every frame the trasckLastPosition system will store the current position in a temporary component named "lastPosition". This is required for using the system resolveCollisions.
* @memberof Systems
* @alias trackLastPosition
* @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
* @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
*/

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
	game.entities.registerSearch("trackLastPositionSearch",["collisions", "position", "size"]);
	ecs.addEach(function trackLastPosition(entity, elapsed) { // eslint-disable-line no-unused-vars
		var position = game.entities.get(entity, "position");
		game.entities.set(entity, "lastPosition", { x: position.x, y: position.y });
	}, "trackLastPositionSearch");
};
