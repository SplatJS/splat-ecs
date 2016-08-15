module.exports = function(ecs, game) {
  ecs.add(function viewportReset() {
    game.context.restore();
  });
};
