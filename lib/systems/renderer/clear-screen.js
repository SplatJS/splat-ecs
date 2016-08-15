module.exports = function(ecs, game) {
  ecs.add(function clearScreen(entities, elapsed) { // eslint-disable-line no-unused-vars
    game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
  });
};
