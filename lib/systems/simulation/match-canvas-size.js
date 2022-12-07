export default function (ecs, game) {
  ecs.addEach(function matchCanvasSize(entity) {
    var size = game.entities.addComponent(entity, "size");
    size.width = game.canvas.width;
    size.height = game.canvas.height;
  }, "matchCanvasSize");
}
