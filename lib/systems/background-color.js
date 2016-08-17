"use strict";

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("backgroundColorSearch", ["backgroundColor", "size", "position"]);
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var color = game.entities.get(entity, "backgroundColor");
    var position = game.entities.get(entity, "position");
    var size = game.entities.get(entity, "size");
    game.context.fillStyle = color;
    game.context.fillRect(position.x, position.y, size.width, size.height);
  }, "backgroundColorSearch");
};

