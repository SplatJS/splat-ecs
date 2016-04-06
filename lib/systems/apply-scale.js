"use strict";

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("applyScale", ["scale", "size"]);
  ecs.addEach(function applyScale(entity, elapsed) { // eslint-disable-line no-unused-vars
    var scale = game.entities.get(entity, "scale");
    console.log(game.entities.get(entity, "scale"));
    if (scale.last) {
      if (scale.last !== scale.current) {
        scaleEntity(game, entity, scale);
        scale.last = scale.current;
      }
    } else {
      var size = game.entities.get(entity, "size");
      game.entities.set(entity, "originalSize", size);
      scaleEntity(game, entity, scale);
      scale.last = scale.current;
    }
  }, "applyScale");
};

function scaleEntity(game, entity, scale) {
  if (scale.current < scale.max) {
    var originalSize = game.entities.get(entity, "originalSize");
    game.entities.set(entity, "size", {
      "width": originalSize.width * scale.current,
      "height": originalSize.height * scale.current
    });
  }
}
