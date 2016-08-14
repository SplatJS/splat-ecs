"use strict";

module.exports = function(ecs, game) {
  game.entities.registerSearch("matchCenterXSearch", ["matchCenterX", "size", "position"]);
  ecs.addEach(function matchCenterX(entity) {
    var position = game.entities.getComponent(entity, "position");
    var size = game.entities.getComponent(entity, "size");

    var matchX = game.entities.getComponent(entity, "matchCenterX").id;
    var matchPosition = game.entities.getComponent(matchX, "position");
    if (matchPosition === undefined) {
      return;
    }
    var matchSize = game.entities.getComponent(matchX, "size");
    if (matchSize === undefined) {
      return;
    }

    position.x = matchPosition.x + (matchSize.width / 2) - (size.width / 2);
  }, "matchCenterXSearch");
};
