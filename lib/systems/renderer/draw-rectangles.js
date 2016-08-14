"use strict";

module.exports = function(ecs, game) {
  game.entities.registerSearch("drawRectangles", ["position", "size"]);
  ecs.addEach(function drawRectangles(entity, elapsed) { // eslint-disable-line no-unused-vars
    var strokeStyle = game.entities.getComponent(entity, "strokeStyle");
    if (strokeStyle) {
      game.context.strokeStyle = strokeStyle;
    }
    var position = game.entities.getComponent(entity, "position");
    var size = game.entities.getComponent(entity, "size");
    game.context.strokeRect(Math.floor(position.x), Math.floor(position.y), size.width, size.height);
  }, "drawRectangles");
};
