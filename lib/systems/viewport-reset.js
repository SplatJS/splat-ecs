"use strict";

module.exports = function viewportReset(ecs, game) { // eslint-disable-line no-unused-vars
	ecs.add(function(entities, context) { // eslint-disable-line no-unused-vars
		context.restore();
	}, "viewport");
};
