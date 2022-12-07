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
export default function (ecs, game) {
  game.entities.registerSearch("revertShakeSearch", ["shake", "position"]);
  ecs.addEach(function revertShake(entity) {
    var shake = game.entities.getComponent(entity, "shake");
    var position = game.entities.getComponent(entity, "position");
    position.x = shake.lastPositionX;
    position.y = shake.lastPositionY;
  }, "revertShakeSearch");
}
