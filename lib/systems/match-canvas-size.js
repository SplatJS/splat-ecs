"use strict";

module.exports = function(ecs, game) {
  ecs.addEach(function matchCanvasSize(entity, elapsed) { // eslint-disable-line no-unused-vars
    var size = game.entities.get(entity, "size");
    if (size === undefined) {
      game.entities.set(entity, "size", {
        width: game.canvas.width,
        height: game.canvas.height
      });
    } else {
      size.width = game.canvas.width;
      size.height = game.canvas.height;
    }
  }, "matchCanvasSize");
};
