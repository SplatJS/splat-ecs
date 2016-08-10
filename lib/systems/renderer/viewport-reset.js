"use strict";

module.exports = function viewportReset(ecs, game) { // eslint-disable-line no-unused-vars
  ecs.add(function(entities, elapsed) { // eslint-disable-line no-unused-vars
    game.context.restore();
  });
};
