"use strict";

export default function (ecs, game) {
  // eslint-disable-line no-unused-vars
  game.entities.registerSearch("backgroundColorSearch", [
    "backgroundColor",
    "size",
    "position",
  ]);
  ecs.addEach(function (entity) {
    // eslint-disable-line no-unused-vars
    var color = game.entities.getComponent(entity, "backgroundColor");
    var position = game.entities.getComponent(entity, "position");
    var size = game.entities.getComponent(entity, "size");
    game.context.fillStyle = color;
    game.context.fillRect(position.x, position.y, size.width, size.height);
  }, "backgroundColorSearch");
}
