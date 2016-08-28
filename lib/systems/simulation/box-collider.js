var boxIntersect = require("box-intersect");

module.exports = function(ecs, game) {

  game.entities.registerSearch("boxCollider", ["position", "size", "collisions"]);

  game.entities.onRemoveComponent("collisions", function(entity, component, collisions) {
    for (var i = 0; i < collisions.length; i++) {
      var otherCollisions = game.entities.getComponent(collisions[i], "collisions");
      var idx = otherCollisions.indexOf(entity);
      if (idx !== -1) {
        otherCollisions.splice(idx, 1);
      }
    }
  });

  var idPool = [];
  var boxPool = [];
  var boxPoolLength = 0;
  function growBoxPool(size) {
    boxPoolLength = size;
    while (boxPool.length < size) {
      for (var i = 0; i < 50; i++) {
        idPool.push(0);
        boxPool.push([0, 0, 0, 0]);
      }
    }
  }

  function handleCollision(a, b) {
    if (a >= boxPoolLength || b >= boxPoolLength) {
      return;
    }
    var idA = idPool[a];
    var idB = idPool[b];
    game.entities.getComponent(idA, "collisions").push(idB);
    game.entities.getComponent(idB, "collisions").push(idA);
  }

  ecs.add(function boxCollider() {
    var ids = game.entities.find("boxCollider");

    growBoxPool(ids.length);

    for (var i = 0; i < ids.length; i++) {
      var entity = ids[i];
      game.entities.getComponent(entity, "collisions").length = 0;
      var position = game.entities.getComponent(entity, "position");
      var size = game.entities.getComponent(entity, "size");
      idPool[i] = entity;
      boxPool[i][0] = position.x;
      boxPool[i][1] = position.y;
      boxPool[i][2] = position.x + size.width;
      boxPool[i][3] = position.y + size.height;
    }
    boxIntersect(boxPool, handleCollision);
  });
};
