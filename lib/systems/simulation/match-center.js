module.exports = function(ecs, game) {
  game.entities.registerSearch("matchCenterXSearch", ["matchCenter", "size", "position"]);
  ecs.addEach(function matchCenterX(entity) {
    var position = game.entities.getComponent(entity, "position");
    var size = game.entities.getComponent(entity, "size");

    var matchCenter = game.entities.getComponent(entity, "matchCenter");

    var idX = matchCenter.x;
    if (idX === undefined) {
      idX = matchCenter.id;
    }
    if (idX !== undefined) {
      verifyTarget(game, idX, adjustX, position, size);
    }

    var idY = matchCenter.y;
    if (idY === undefined) {
      idY = matchCenter.id;
    }
    if (idY !== undefined) {
      verifyTarget(game, idY, adjustY, position, size);
    }
  }, "matchCenterXSearch");
};

function verifyTarget(game, target, fn, position, size) {
  var matchPosition = game.entities.getComponent(target, "position");
  if (matchPosition === undefined) {
    return;
  }
  var matchSize = game.entities.getComponent(target, "size");
  if (matchSize === undefined) {
    return;
  }

  fn(position, size, matchPosition, matchSize);
}

function adjustX(position, size, matchPosition, matchSize) {
  position.x = matchPosition.x + (matchSize.width / 2) - (size.width / 2);
}

function adjustY(position, size, matchPosition, matchSize) {
  position.y = matchPosition.y + (matchSize.height / 2) - (size.height / 2);
}
