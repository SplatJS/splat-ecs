"use strict";

/**
 * System that looks for an entity with the {@link Components.shake} and {@link Components.position} components.
 * After each iteration of the applyShake system, the revertShake system will move the entity back to where it started
 * @memberof Systems
 * @alias revertShake
 * @requires Systems.applyShake
 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
 * @see [applyShake]{@link Systems.applyShake}
 */

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("revertShakeSearch",["shake", "position"]);
  ecs.addEach(function revertShake(entity, elapsed) { // eslint-disable-line no-unused-vars
    var shake = game.entities.get(entity, "shake");
    var position = game.entities.get(entity, "position");
    position.x = shake.lastPositionX;
    position.y = shake.lastPositionY;
  }, "revertShakeSearch");
};
