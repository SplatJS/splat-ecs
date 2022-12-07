/**
 * System that looks for an entity with the {@link Components.friction} and {@link Components.velocity} components.
 * Every frame the apply friction system will modify the entity's velocity by the friction.
 * @memberof Systems
 * @alias applyFriction
 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
 */
export default function (ecs, game) {
  game.entities.registerSearch("applyFriction", ["velocity", "friction"]);
  ecs.addEach(function applyFriction(entity) {
    var velocity = game.entities.getComponent(entity, "velocity");
    var friction = game.entities.getComponent(entity, "friction");
    velocity.x *= friction.x;
    velocity.y *= friction.y;
  }, "applyFriction");
}
