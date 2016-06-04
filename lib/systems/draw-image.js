"use strict";

function drawEntity(game, entity, context) {
	var imageComponent = game.entities.get(entity, "image");

	var image = imageComponent.buffer;
	if (!image) {
		image = game.images.get(imageComponent.name);
	}
	if (!image) {
		console.error("No such image", imageComponent.name, "for entity", entity, game.entities.get(entity, "name"));
		return;
	}

	// FIXME: disable these checks/warnings in production version

	var sx = imageComponent.sourceX || 0;
	var sy = imageComponent.sourceY || 0;

	var dx = imageComponent.destinationX || 0;
	var dy = imageComponent.destinationY || 0;

	var size = game.entities.get(entity, "size") || { "width": 0, "height": 0 };

	var sw = imageComponent.sourceWidth || image.width;
	if (sw === 0) {
		console.warn("sourceWidth is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
	}
	var sh = imageComponent.sourceHeight || image.height;
	if (sh === 0) {
		console.warn("sourceHeight is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
	}

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

		var rotation = game.entities.get(entity, "rotation");
		if (rotation !== undefined) {
			context.save();
			var rx = rotation.x || size.width / 2 || 0;
			var ry = rotation.y || size.height / 2 || 0;
			var x = position.x + rx;
			var y = position.y + ry;
			context.translate(x, y);
			context.rotate(rotation.angle);

			dx2 = dx - rx;
			dy2 = dy - ry;
		}

		var alpha = 1;
		if (imageComponent.alpha !== undefined) {
			alpha = imageComponent.alpha;
		}
		context.globalAlpha = alpha;
		context.drawImage(image, sx, sy, sw, sh, dx2, dy2, dw, dh);

		if (rotation !== undefined) {
			context.restore();
		}
	} catch (e) {
		console.error("Error drawing image", imageComponent.name, e);
	}
}

module.exports = function(ecs, game) {
	game.entities.registerSearch("drawImage", ["image", "position"]);
	ecs.add(function drawImage(entities, elapsed) { // eslint-disable-line no-unused-vars
		var ids = entities.find("drawImage");
		ids.sort(function(a, b) {
			var pa = entities.get(a, "position");
			var pb = entities.get(b, "position");
			var za = pa.z || 0;
			var zb = pb.z || 0;
			var ya = pa.y || 0;
			var yb = pb.y || 0;
			return za - zb || ya - yb || a - b;
		});

		for (var i = 0; i < ids.length; i++) {
			drawEntity(game, ids[i], game.context);
		}
	});
};
