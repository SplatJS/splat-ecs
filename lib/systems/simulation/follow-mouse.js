"use strict";

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
    var position = game.entities.get(entity, "position");
    var camera = game.entities.find("camera")[0];
    var cameraPosition = game.entities.get(camera, "position");
    position.x = cameraPosition.x + game.inputs.mouse.x;
    position.y = cameraPosition.y + game.inputs.mouse.y;
  }, "followMouse");
};

