"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function advanceTimers(entity, elapsed) {
		var timers = data.entities.get(entity, "timers");
		var names = Object.keys(timers);

		names.forEach(function(name) {
			var timer = timers[name];
			if (!timer.running) {
				return;
			}

			timer.time += elapsed;

			if (timer.time > timer.max) {
				timer.running = false;
				timer.time = 0;

				if (timer.script !== undefined) {
					var script = data.require(timer.script);
					script(entity, data);
				}
			}
		});
	}, "timers");
};
