export default function (ecs, game) {
  game.entities.registerSearch("constrainPositionSearch", [
    "position",
    "size",
    "constrainPosition",
  ]);
  ecs.addEach(function constrainTocontrainPosition(entity) {
    var position = game.entities.getComponent(entity, "position");
    var size = game.entities.getComponent(entity, "size");

    var constrainPosition = game.entities.getComponent(
      entity,
      "constrainPosition"
    );
    var other = constrainPosition.id;
    var otherPosition = game.entities.getComponent(other, "position");
    var otherSize = game.entities.getComponent(other, "size");

    if (position.x < otherPosition.x) {
      position.x = otherPosition.x;
    }
    if (position.x + size.width > otherPosition.x + otherSize.width) {
      position.x = otherPosition.x + otherSize.width - size.width;
    }
    if (position.y < otherPosition.y) {
      position.y = otherPosition.y;
    }
    if (position.y + size.height > otherPosition.y + otherSize.height) {
      position.y = otherPosition.y + otherSize.height - size.height;
    }
  }, "constrainPositionSearch");
}
