module.exports = function(ecs, game) {
  ecs.add(function clearScreen() {
    game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
  });
};
