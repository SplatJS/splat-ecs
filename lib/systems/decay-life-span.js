"use strict";

module.exports = function(ecs, game) {
	ecs.addEach(function decayLifeSpan(entity, elapsed) {
		var lifeSpan = game.entities.get(entity, "lifeSpan");
		lifeSpan.current += elapsed;
		if (lifeSpan.current >= lifeSpan.max) {
			game.entities.destroy(entity);
		}
	}, "lifeSpan");
};
