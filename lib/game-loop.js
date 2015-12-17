"use strict";

var timeAccumulator = require("time-accumulator");

module.exports = function(entities, simulation, simulationStepTime, renderer, context) {
	var run = timeAccumulator(simulationStepTime);
	var timeDelta = require("./absolute-to-relative")();
	var running = true;

	// run simulation the first time, because not enough time will have elapsed
	simulation.run(entities, 0);

	function render(time) {
		if (!running) {
			return;
		}

		var elapsed = timeDelta(time);
		run(elapsed, function(elapsed) {
			simulation.run(entities, elapsed);
		});

		context.save();
		renderer.run(entities, context, elapsed);
		context.restore();

		if (running) {
			window.requestAnimationFrame(render);
		}
	}
	window.requestAnimationFrame(render);

	return function() {
		running = false;
	};
};
