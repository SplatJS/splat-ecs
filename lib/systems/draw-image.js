"use strict";

function drawEntity(game, entity) {
	var imageComponent = game.entities.get(entity, "image");

	var image = imageComponent.buffer;
	if (!image) {
		image = game.renderer.sprites[imageComponent.name];
	}
	if (!image) {
		console.error("No such image", imageComponent.name, "for entity", entity, game.entities.get(entity, "name"));
		return;
	}

	// FIXME: disable these checks/warnings in production version

	var dx = imageComponent.destinationX || 0;
	var dy = imageComponent.destinationY || 0;

	var size = game.entities.get(entity, "size") || { "width": 0, "height": 0 };

	var dw = imageComponent.destinationWidth || size.width || image.width;
	if (dw === 0) {
		console.warn("destinationWidth is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
	}
	var dh = imageComponent.destinationHeight || size.height || image.height;
	if (dh === 0) {
		console.warn("destinationHeight is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
	}

	try {
		var position = game.entities.get(entity, "position");

		var dx2 = dx + position.x;
		var dy2 = dy + position.y;

	// 	var rotation = game.entities.get(entity, "rotation");
	// 	if (rotation !== undefined) {
	// 		// context.save();
	// 		var rx = rotation.x || size.width / 2 || 0;
	// 		var ry = rotation.y || size.height / 2 || 0;
	// 		var x = position.x + rx;
	// 		var y = position.y + ry;
	// 		context.translate(x, y);
	// 		context.rotate(rotation.angle);

	// 		dx2 = dx - rx;
	// 		dy2 = dy - ry;
	// 	}

		game.renderer.addSprite(imageComponent.name, dx2, dy2, dw, dh);

	// 	if (rotation !== undefined) {
	// 		// context.restore();
	// 	}
	} catch (e) {
		console.error("Error drawing image", imageComponent.name, e);
	}
}

module.exports = function(ecs, game) {
	game.entities.registerSearch("drawImage", ["image", "position"]);
	ecs.add(function drawImage(entities) {
		var ids = entities.find("drawImage");
		ids.sort(function(a, b) {
			var za = (entities.get(a, "zindex") || { zindex: 0 }).zindex;
			var zb = (entities.get(b, "zindex") || { zindex: 0 }).zindex;
			var ya = (entities.get(a, "position") || { y: 0 }).y;
			var yb = (entities.get(b, "position") || { y: 0 }).y;
			return za - zb || ya - yb;
		});

		game.renderer.beginSprites(ids.length);
		for (var i = 0; i < ids.length; i++) {
			drawEntity(game, ids[i]);
		}
		game.renderer.flush();
	});
};
