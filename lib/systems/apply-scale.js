"use strict";

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("applyScale", ["scale", "size"]);
  ecs.addEach(function applyScale(entity, elapsed) { // eslint-disable-line no-unused-vars
    var percent = game.entities.get(entity, "scale");
    if (game.entities.get(entity, "lastScale")) {
      if (game.entities.get(entity, "lastScale") !== percent) {
        scaleEntity(game, entity, percent);
        game.entities.set(entity, "lastScale", percent);
      }
    } else {
      var size = game.entities.get(entity, "size");
      game.entities.set(entity, "originalSize", size);
      scaleEntity(game, entity, percent);
      game.entities.set(entity, "lastScale", percent);
    }
  }, "applyScale");
};

function scaleEntity(game, entity, percent) {
  var originalSize = game.entities.get(entity, "originalSize");
  game.entities.set(entity, "size", {
    "width": originalSize.width * percent,
    "height": originalSize.height * percent
  });
}
