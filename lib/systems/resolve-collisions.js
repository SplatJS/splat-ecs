"use strict";

/**
* System that looks for an entity with the {@link Components.collisons}, {@link Components.velocity}, {@link Components.lastPosition}, {@link Components.position}, and {@link Components.size} components.
* Every frame the resolveCollisions system will check to see if any applicable entities are intersecting with an entity with the component {@link Components.body}, and if they are it will reset them to previous position either left, right, above, or below the other each other appropriately.
* @memberof Systems
* @alias resolveCollisions
* @requires Systems.lastPosition
* @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
* @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
*/

function wasLeft(entityLastPosition, entitySize, otherPosition) {
	return entityLastPosition.x + entitySize.width <= otherPosition.x;
}
function wasRight(entityLastPosition, otherPosition, otherSize) {
	return entityLastPosition.x >= otherPosition.x + otherSize.width;
}
function wasAbove(entityLastPosition, entitySize, otherPosition) {
	return entityLastPosition.y + entitySize.height <= otherPosition.y;
}
function wasBelow(entityLastPosition, otherPosition, otherSize) {
	return entityLastPosition.y >= otherPosition.y + otherSize.height;
}

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
	game.entities.registerSearch("resolveCollisionsSearch", ["collisions","velocity","lastPosition","position","size"]);
	ecs.addEach(function resolveCollisions(entity, elapsed) { // eslint-disable-line no-unused-vars
		var entityCollisions = game.entities.get(entity, "collisions");
		var entityPosition = game.entities.get(entity, "position");
		var entitySize = game.entities.get(entity, "size");
		var entityVelocity = game.entities.get(entity, "velocity");
		var entityLastPosition = game.entities.get(entity, "lastPosition");

		for (var i = 0; i < entityCollisions.length; i++) {
			var other = entityCollisions[i];
			if (game.entities.get(other, "body")) {
				var otherPosition = game.entities.get(other, "position");
				var otherSize = game.entities.get(other, "size");

				if (wasLeft(entityLastPosition, entitySize, otherPosition)) {
					entityPosition.x = otherPosition.x - entitySize.width;
					entityVelocity.x = 0;
				}
				if (wasRight(entityLastPosition, otherPosition, otherSize)) {
					entityPosition.x = otherPosition.x + otherSize.width;
					entityVelocity.x = 0;
				}
				if (wasAbove(entityLastPosition, entitySize, otherPosition)) {
					entityPosition.y = otherPosition.y - entitySize.height;
					entityVelocity.y = 0;
				}
				if (wasBelow(entityLastPosition, otherPosition, otherSize)) {
					entityPosition.y = otherPosition.y + otherSize.height;
					entityVelocity.y = 0;
				}
			}
		}
	}, "resolveCollisionsSearch");

};
