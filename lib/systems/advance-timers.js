"use strict";

module.exports = function(ecs, game) {
	ecs.addEach(function advanceTimers(entity, elapsed) {
		var timers = game.entities.get(entity, "timers");
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
					var script = game.require(timer.script);
					script(entity, game);
				}
			}
		});
	}, "timers");
};
