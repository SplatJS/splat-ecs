"use strict";

module.exports = function(ecs, game) {
  game.entities.registerSearch("setVirtualButtons", ["virtualButton", "position", "size"]);
  ecs.addEach(function setVirtualButtons(entity) {
    var virtualButton = game.entities.getComponent(entity, "virtualButton");
    var position = game.entities.getComponent(entity, "position");
    var size = game.entities.getComponent(entity, "size");

    var camera = game.entities.find("camera")[0];
    var cameraPosition = { x: 0, y: 0 };
    if (camera !== undefined) {
      cameraPosition = game.entities.getComponent(camera, "position");
    }

    for (var i = 0; i < game.inputs.mouse.touches.length; i++) {
      var t = game.inputs.mouse.touches[i];
      var tx = t.x + cameraPosition.x;
      var ty = t.y + cameraPosition.y;
      if (tx >= position.x && tx < position.x + size.width && ty >= position.y && ty < position.y + size.height) {
        game.inputs.setButton(virtualButton, entity, true);
        return true;
      }
    }
    game.inputs.setButton(virtualButton, entity, false);
  }, "setVirtualButtons");
};
