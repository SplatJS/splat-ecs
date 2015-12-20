"use strict";

var boxIntersect = require("box-intersect");

module.exports = function(ecs, data) {

	data.entities.registerSearch("boxCollider", ["position", "size", "collisions"]);

	var boxPool = [];
	var boxPoolLength = 0;
	function growBoxPool(size) {
		boxPoolLength = size;
		while (boxPool.length < size) {
			for (var i = 0; i < 50; i++) {
				boxPool.push([0, 0, 0, 0]);
			}
		}
	}

	ecs.add(function boxCollider(entities, elapsed) { // eslint-disable-line no-unused-vars
		var ids = data.entities.find("boxCollider");

		growBoxPool(ids.length);
		ids.forEach(function(entity, i) {
			data.entities.get(entity, "collisions").length = 0;
			var position = data.entities.get(entity, "position");
			var size = data.entities.get(entity, "size");
			boxPool[i][0] = position.x;
			boxPool[i][1] = position.y;
			boxPool[i][2] = position.x + size.width;
			boxPool[i][3] = position.y + size.height;
		});
		boxIntersect(boxPool, function(a, b) {
			if (a >= boxPoolLength || b >= boxPoolLength) {
				return;
			}
			var idA = ids[a];
			var idB = ids[b];
			data.entities.get(idA, "collisions").push(idB);
			data.entities.get(idB, "collisions").push(idA);
		});
	});
};
