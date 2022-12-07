/**
 * System that looks for an entity with the {@link Components.acceleration} and {@link Components.velocity} components.
 * Every frame the apply acceleration system will modify the entity's velocity by the acceleration per elapsed millisecond.
 * @memberof Systems
 * @alias applyAcceleration
 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
 */
module.exports = function(ecs, game) {
  game.entities.registerSearch("applyAcceleration", ["acceleration", "velocity"]);
  ecs.addEach(function applyAcceleration(entity, elapsed) {
    var velocity = game.entities.getComponent(entity, "velocity");
    var acceleration = game.entities.getComponent(entity, "acceleration");
    velocity.x += acceleration.x * elapsed;
    velocity.y += acceleration.y * elapsed;
  }, "applyAcceleration");
};
