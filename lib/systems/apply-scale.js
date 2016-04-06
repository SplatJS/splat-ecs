"use strict";

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("applyScale", ["scale", "size"]);
  ecs.addEach(function applyScale(entity, elapsed) { // eslint-disable-line no-unused-vars
    var scale = game.entities.get(entity, "scale");
    if (scale.last) {
      if (scale.last !== scale.current) {
        scaleWithMax(game, entity, scale);
      }
    } else {
      var size = game.entities.get(entity, "size");
      game.entities.set(entity, "originalSize", size);
      scaleWithMax(game, entity, scale);
    }
  }, "applyScale");
};

function scaleWithMax(game, entity, scale) {
  if (scale.max) {
    if (scale.current < scale.max) {
      scaleEntity(game, entity, scale);
    }
  } else {
    scaleEntity(game, entity, scale);
  }
}

function scaleEntity(game, entity, scale) {
  var originalSize = game.entities.get(entity, "originalSize");
  game.entities.set(entity, "size", {
    "width": originalSize.width * scale.current,
    "height": originalSize.height * scale.current
  });
  scale.last = scale.current;
}
