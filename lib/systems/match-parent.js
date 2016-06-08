"use strict";

module.exports = function(ecs, game) {
  game.entities.registerSearch("matchParent", ["position", "match"]);
  ecs.addEach(function matchParent(entity, elapsed) { // eslint-disable-line no-unused-vars
    var match = game.entities.get(entity, "match");

    var parentPosition = game.entities.get(match.id, "position");
    if (parentPosition === undefined) {
      return;
    }

    game.entities.set(entity, "position", {
      x: parentPosition.x + match.offsetX,
      y: parentPosition.y + match.offsetY,
      z: parentPosition.z + match.offsetZ
    });
  }, "matchParent");
};
