"use strict";

export default function (ecs, game) {
  // eslint-disable-line no-unused-vars
  ecs.addEach(function (entity) {
    // eslint-disable-line no-unused-vars
    var position = game.entities.getComponent(entity, "position");
    var camera = game.entities.find("camera")[0];
    var cameraPosition = game.entities.getComponent(camera, "position");
    position.x = cameraPosition.x + game.inputs.mouse.x;
    position.y = cameraPosition.y + game.inputs.mouse.y;
  }, "followMouse");
}
