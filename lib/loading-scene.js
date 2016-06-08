"use strict";

var Scene = require("./scene");

module.exports = function(game, percentLoaded, nextScene) {
  var scene = new Scene();
  scene.renderer.add(function renderLoadingScene() {
    game.context.fillStyle = "#000000";
    game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

    var quarterWidth = Math.floor(game.canvas.width / 4);
    var halfWidth = Math.floor(game.canvas.width / 2);
    var halfHeight = Math.floor(game.canvas.height / 2);

    game.context.fillStyle = "#ffffff";
    game.context.fillRect(quarterWidth, halfHeight - 15, halfWidth, 30);

    game.context.fillStyle = "#000000";
    game.context.fillRect(quarterWidth + 3, halfHeight - 12, halfWidth - 6, 24);

    game.context.fillStyle = "#ffffff";
    var barWidth = (halfWidth - 6) * percentLoaded();
    game.context.fillRect(quarterWidth + 3, halfHeight - 12, barWidth, 24);

    if (percentLoaded() === 1) {
      scene.stop();
      nextScene.start(game.context);
    }
  });
  return scene;
};
