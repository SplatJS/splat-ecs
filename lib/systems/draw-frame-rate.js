"use strict";

module.exports = function(ecs, game) {
	ecs.add(function drawFrameRate(entities, context, elapsed) {
		var fps = Math.floor(1000 / elapsed);

		context.font = "24px mono";
		if (fps < 30) {
			context.fillStyle = "red";
		} else if (fps < 50) {
			context.fillStyle = "yellow";
		} else {
			context.fillStyle = "green";
		}

		var msg = fps + " FPS";
		var w = context.measureText(msg).width;
		context.fillText(msg, game.canvas.width - w - 50, 50);
	});
};
