"use strict";

module.exports = function(ecs, game) {
  game.entities.registerSearch("centerPosition", ["position", "center"]);
  ecs.addEach(function centerPosition(entity, elapsed) { // eslint-disable-line no-unused-vars
    var position = game.entities.get(entity, "position");
    var center = game.entities.get(entity, "center");
    var size = game.entities.get(entity, "size");
    // FIXME: doesn't work with cameras yet.
    if (center.x) {
      position.x = Math.floor(game.canvas.width / 2);
      if (size) {
        position.x -= Math.floor(size.width / 2);
      }
    }
    if (center.y) {
      position.y = Math.floor(game.canvas.height / 2);
      if (size) {
        position.y -= Math.floor(size.height / 2);
      }
    }
  }, "centerPosition");
};
