"use strict";

module.exports = function(ecs, game) {
	ecs.add(function drawFrameRate(entities, context, elapsed) {
		var fps = Math.floor(1000 / elapsed);

		game.renderer.font = "24px mono";
		if (fps < 30) {
			game.renderer.fillStyle = "red";
		} else if (fps < 50) {
			game.renderer.fillStyle = "yellow";
		} else {
			game.renderer.fillStyle = "green";
		}

		var msg = fps + " FPS";
		var w = game.renderer.measureText(msg).width;
		game.renderer.fillText(msg, game.canvas.width - w - 50, 50);
	});
};
