module.exports = function(ecs, game) {
  game.entities.registerSearch("matchAspectRatioSearch", ["matchAspectRatio", "size"]);
  ecs.addEach(function matchCanvasSize(entity) {
    var size = game.entities.getComponent(entity, "size");

    var match = game.entities.getComponent(entity, "matchAspectRatio").id;
    var matchSize = game.entities.getComponent(match, "size");
    if (matchSize === undefined) {
      return;
    }

    var matchAspectRatio = matchSize.width / matchSize.height;

    var currentAspectRatio = size.width / size.height;
    if (currentAspectRatio > matchAspectRatio) {
      size.height = Math.floor(size.width / matchAspectRatio);
    } else if (currentAspectRatio < matchAspectRatio) {
      size.width = Math.floor(size.height * matchAspectRatio);
    }
  }, "matchAspectRatioSearch");
};
