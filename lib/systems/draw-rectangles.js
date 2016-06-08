"use strict";

module.exports = function(ecs, game) {
  game.entities.registerSearch("drawRectangles", ["position", "size"]);
  ecs.addEach(function drawRectangles(entity, elapsed) { // eslint-disable-line no-unused-vars
    var strokeStyle = game.entities.get(entity, "strokeStyle");
    if (strokeStyle) {
      game.context.strokeStyle = strokeStyle;
    }
    var position = game.entities.get(entity, "position");
    var size = game.entities.get(entity, "size");
    game.context.strokeRect(Math.floor(position.x), Math.floor(position.y), size.width, size.height);
  }, "drawRectangles");
};
