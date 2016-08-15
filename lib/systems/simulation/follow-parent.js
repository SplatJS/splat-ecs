function distanceSquared(x1, y1, x2, y2) {
  return ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
}

module.exports = function(ecs, game) {
  game.entities.registerSearch("followParent", ["position", "size", "follow"]);
  ecs.addEach(function followParent(entity, elapsed) { // eslint-disable-line no-unused-vars
    var position = game.entities.getComponent(entity, "position");
    var follow = game.entities.getComponent(entity, "follow");
    var size = game.entities.getComponent(entity, "size");

    var x1 = position.x + (size.width / 2);
    var y1 = position.y + (size.height / 2);

    var parent = follow.id;
    if (game.entities.getComponent(parent, "id") === undefined) {
      return;
    }
    var parentPosition = game.entities.getComponent(parent, "position");
    var parentSize = game.entities.getComponent(parent, "size");

    var x2 = parentPosition.x + (parentSize.width / 2);
    var y2 = parentPosition.y + (parentSize.height / 2);

    var angle = Math.atan2(y2 - y1, x2 - x1);
    var rotation = game.entities.getComponent(entity, "rotation");
    if (rotation !== undefined) {
      rotation.angle = angle - (Math.PI / 2);
    }

    var distSquared = distanceSquared(x1, y1, x2, y2);
    if (distSquared < follow.distance * follow.distance) {
      return;
    }

    var toMove = Math.sqrt(distSquared) - follow.distance;

    position.x += toMove * Math.cos(angle);
    position.y += toMove * Math.sin(angle);
  }, "followParent");
};
