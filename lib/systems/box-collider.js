"use strict";

var boxIntersect = require("box-intersect");

module.exports = function(ecs, game) {

  game.entities.registerSearch("boxCollider", ["position", "size", "collisions"]);

  game.entities.onRemoveComponent("collisions", function(entity, component, collisions) {
    for (var i = 0; i < collisions.length; i++) {
      var otherCollisions = game.entities.get(collisions[i], "collisions");
      var idx = otherCollisions.indexOf(entity);
      if (idx !== -1) {
        otherCollisions.splice(idx,1);
      }
    }
  });

  var boxPool = [];
  var boxPoolLength = 0;
  function growBoxPool(size) {
    boxPoolLength = size;
    while (boxPool.length < size) {
      for (var i = 0; i < 50; i++) {
        boxPool.push([0, 0, 0, 0]);
      }
    }
  }

  ecs.add(function boxCollider(entities, elapsed) { // eslint-disable-line no-unused-vars
    var ids = game.entities.find("boxCollider");

    growBoxPool(ids.length);
    ids.forEach(function(entity, i) {
      game.entities.get(entity, "collisions").length = 0;
      var position = game.entities.get(entity, "position");
      var size = game.entities.get(entity, "size");
      boxPool[i][0] = position.x;
      boxPool[i][1] = position.y;
      boxPool[i][2] = position.x + size.width;
      boxPool[i][3] = position.y + size.height;
    });
    boxIntersect(boxPool, function(a, b) {
      if (a >= boxPoolLength || b >= boxPoolLength) {
        return;
      }
      var idA = ids[a];
      var idB = ids[b];
      game.entities.get(idA, "collisions").push(idB);
      game.entities.get(idB, "collisions").push(idA);
    });
  });
};
