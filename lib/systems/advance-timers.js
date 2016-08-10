"use strict";

/**
 * System that looks for an entity with the {@link Components.timers} components.
 * Every frame the advanceTimers system will loop through an entity's timers component and increment the "time" property by the elapsed time since the last frame. If the timer is set to loop it will restart the time when it hits max.
 * @memberof Systems
 * @alias advanceTimers
 * @see [addEach]{@link https://github.com/ericlathrop/entity-component-system#addeachsystem-search}
 * @see [registerSearch]{@link https://github.com/ericlathrop/entity-component-system#registersearchsearch-components}
 */

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

			while (timer.time > timer.max) {
				if (timer.loop) {
					timer.time -= timer.max;
				} else {
					timer.running = false;
					timer.time = 0;
				}
				if (timer.script !== undefined) {
					var script = game.require(timer.script);
					script(entity, game);
				}
			}
		});
	}, "timers");
};
