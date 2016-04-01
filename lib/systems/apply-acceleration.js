"use strict";

module.exports = function(ecs, game) { // eslint-disable-line no-unused-vars
  game.entities.registerSearch("applyAccelerationSearch", ["acceleration", "velocity"]);
  ecs.addEach(function applyAcceleration(entity, elapsed) { // eslint-disable-line no-unused-vars
    var velocity = game.entities.get(entity, "velocity");
    var applyAcceleration = game.entities.get(entity, "acceleration");
    velocity.x += elapsed * applyAcceleration.x;
    velocity.y += elapsed * applyAcceleration.y;
  }, "applyAccelerationSearch");
};
