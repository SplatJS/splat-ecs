"use strict";

function roundRect(context, x, y, width, height, radius, stroke) {
  if (typeof stroke == "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  if (stroke) {
    context.stroke();
  }
  context.fill();
}

module.exports = function(ecs, game) {
  ecs.add(function drawFrameRate(entities, elapsed) {
    var fps = Math.floor(1000 / elapsed);

    var msg = fps + " FPS";
    game.context.font = "24px monospace";
    var w = game.context.measureText(msg).width;

    game.context.fillStyle = "rgba(0,0,0,0.8)";
    game.context.strokeStyle = "rgba(0,0,0,0.9)";
    roundRect(game.context, game.canvas.width - 130, -5, 120, 45, 5);

    if (fps < 30) {
      game.context.fillStyle = "#FE4848"; //red
    } else if (fps < 50) {
      game.context.fillStyle = "#FDFA3C"; //yellow
    } else {
      game.context.fillStyle = "#38F82A"; //green
    }

    if (fps < 10) {
      fps = " " + fps;
    }

    game.context.fillText(msg, game.canvas.width - w - 26, 25);
  });
};
