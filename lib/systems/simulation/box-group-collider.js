var BoxPool = require("../../box-pool");

module.exports = function(ecs, game) {

  game.entities.registerSearch("boxColliderSearch", ["position", "size", "boxCollider"]);

  game.entities.onRemoveComponent("collisions", function(entity, component, collisions) {
    for (var i = 0; i < collisions.entities.length; i++) {
      var otherCollisions = game.entities.getComponent(collisions.entities[i], "boxCollider");
      var idx = otherCollisions.entities.indexOf(entity);
      if (idx !== -1) {
        otherCollisions.entities.splice(idx, 1);
      }
    }
  });

  var boxPoolNames = [ "unnamed" ];
  var boxPools = {
    unnamed: new BoxPool()
  };

  function handleCollision(a, b) {
    handleCollision2(game, a, b);
    handleCollision2(game, b, a);
  }

  ecs.add(function boxGroupCollider() {
    var ids = game.entities.find("boxColliderSearch");

    for (var i = 0; i < boxPoolNames.length; i++) {
      boxPools[boxPoolNames[i]].reset();
    }

    for (i = 0; i < ids.length; i++) {
      var entity = ids[i];
      var collisions = game.entities.getComponent(entity, "boxCollider");
      collisions.entities.length = 0;
      var position = game.entities.getComponent(entity, "position");
      var size = game.entities.getComponent(entity, "size");

      var name = collisions.group || "unnamed";
      if (!boxPools[name]) {
        boxPoolNames.push(name);
        boxPools[name] = new BoxPool();
      }
      boxPools[name].add(entity, position, size);
    }
    for (i = 0; i < boxPoolNames.length; i++) {
      for (var j = i + 1; j < boxPoolNames.length; j++) {
        var aName = boxPoolNames[i];
        var bName = boxPoolNames[j];
        if (areGroupsExcluded(game, aName, bName)) {
          continue;
        }

        var a = boxPools[aName];
        var b = boxPools[bName];
        if (a && b) {
          a.collideOther(b, handleCollision);
        }
      }
    }
    boxPools["unnamed"].collideSelf(handleCollision);
    for (i = 0; i < ids.length; i++) {
      updateLastCollisions(game, ids[i]);
    }
  });
};

function areGroupsExcluded(game, a, b) {
  var config = game.sceneConfig["box-group-collider"];
  if (!config) {
    return false;
  }
  var skip = config.skip;
  if (!skip) {
    return false;
  }
  for (var i = 0; i < skip.length; i++) {
    if (
      (skip[i][0] === a && skip[i][1] === b) ||
      (skip[i][0] === b && skip[i][1] === a)
    ) {
      return true;
    }
  }
  return false;
}

function updateLastCollisions(game, entity) {
  var collisions = game.entities.getComponent(entity, "boxCollider");

  if (collisions.onExit) {
    var currentCollisions = {};
    for (var j = 0; j < collisions.entities.length; j++) {
      currentCollisions[collisions.entities[j]] = true;
    }
    for (var k = 0; k < collisions.last.length; k++) {
      if (!currentCollisions[collisions.last[k]]) {
        var onExit = game.require(collisions.onExit);
        onExit(entity, collisions.last[k], game);
      }
    }
  }

  if (collisions.last) {
    collisions.last.length = 0;
  } else {
    collisions.last = [];
  }
  for (var i = 0; i < collisions.entities.length; i++) {
    collisions.last.push(collisions.entities[i]);
  }
}

function handleCollision2(game, entity, other) {
  var collisions = game.entities.getComponent(entity, "boxCollider");
  collisions.entities.push(other);
  if (collisions.onEnter && collisions.last.indexOf(other) === -1) {
    var onEnter = game.require(collisions.onEnter);
    onEnter(entity, other, game);
  }
  if (collisions.script) {
    var script = game.require(collisions.script);
    script(entity, other, game);
  }
}
