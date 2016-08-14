"use strict";

module.exports = function(ecs, game) {
  game.entities.registerSearch("matchCenterYSearch", ["matchCenterY", "size", "position"]);
  ecs.addEach(function matchCenterY(entity) {
    var position = game.entities.getComponent(entity, "position");
    var size = game.entities.getComponent(entity, "size");

    var matchY = game.entities.getComponent(entity, "matchCenterY").id;
    var matchPosition = game.entities.getComponent(matchY, "position");
    if (matchPosition === undefined) {
      return;
    }
    var matchSize = game.entities.getComponent(matchY, "size");
    if (matchSize === undefined) {
      return;
    }

    position.y = matchPosition.y + (matchSize.height / 2) - (size.height / 2);
  }, "matchCenterYSearch");
};
