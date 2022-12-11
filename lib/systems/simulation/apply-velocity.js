/**
 * System that looks for an entity with the {@link Components.position} and {@link Components.velocity} components.
 * Every frame the apply velocity system will move the entity's position by the velocity per elapsed millisecond.
 * @memberof Systems
 * @alias applyVelocity
 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
 */
export default function (ecs, game) {
  game.entities.registerSearch("applyVelocity", ["position", "velocity"]);
  ecs.addEach(function applyVelocity(entity, elapsed) {
    var position = game.entities.getComponent(entity, "position");
    var velocity = game.entities.getComponent(entity, "velocity");
    position.x += velocity.x * elapsed;
    position.y += velocity.y * elapsed;
    position.z += velocity.z * elapsed;
  }, "applyVelocity");
}
