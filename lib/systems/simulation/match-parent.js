module.exports = function(ecs, game) {
  game.entities.registerSearch("matchParent", ["position", "match"]);
  ecs.addEach(function matchParent(entity) {
    var match = game.entities.getComponent(entity, "match");

    var parentPosition = game.entities.getComponent(match.id, "position");
    if (parentPosition === undefined) {
      return;
    }

    var position = game.entities.addComponent(entity, "position");
    position.x = parentPosition.x + match.offsetX;
    position.y = parentPosition.y + match.offsetY;
    position.z = parentPosition.z + match.offsetZ;
  }, "matchParent");
};
