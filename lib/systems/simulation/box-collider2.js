var BoxPool = require("../../box-pool");

module.exports = function(ecs, game) {

  game.entities.registerSearch("boxCollider", ["position", "size", "collisions2"]);

  game.entities.onRemoveComponent("collisions", function(entity, component, collisions) {
    for (var i = 0; i < collisions.entities.length; i++) {
      var otherCollisions = game.entities.getComponent(collisions.entities[i], "collisions2");
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

  ecs.add(function boxCollider() {
    var ids = game.entities.find("boxCollider");

    for (var i = 0; i < boxPoolNames.length; i++) {
      boxPools[boxPoolNames[i]].reset();
    }

    for (i = 0; i < ids.length; i++) {
      var entity = ids[i];
      var collisions = game.entities.getComponent(entity, "collisions2");
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
        var a = boxPools[boxPoolNames[i]];
        var b = boxPools[boxPoolNames[j]];
        a.collideOther(b, handleCollision);
      }
    }
    boxPools["unnamed"].collideSelf(handleCollision);
    for (i = 0; i < ids.length; i++) {
      updateLastCollisions(game, ids[i]);
    }
  });
};

function updateLastCollisions(game, entity) {
  var collisions = game.entities.getComponent(entity, "collisions2");

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
  var collisions = game.entities.getComponent(entity, "collisions2");
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