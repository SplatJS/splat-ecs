"use strict";

function drawEntity(data, entity, context) {
	var imageComponent = data.entities.get(entity, "image");

	var image = imageComponent.buffer;
	if (!image) {
		image = data.images.get(imageComponent.name);
	}
	if (!image) {
		console.error("No such image", imageComponent.name, "for entity", entity, data.entities.get(entity, "name"));
		return;
	}

	// FIXME: disable these warnings in production version
	var sx = imageComponent.sourceX || 0;
	var sy = imageComponent.sourceY || 0;

	var dx = imageComponent.destinationX || 0;
	var dy = imageComponent.destinationY || 0;

	var sw = imageComponent.sourceWidth || image.width;
	if (sw === 0) {
		console.warn("sourceWidth is 0, image would be invisible for entity", entity, data.entities.get(entity, "name"));
	}
	var sh = imageComponent.sourceHeight || image.height;
	if (sh === 0) {
		console.warn("sourceHeight is 0, image would be invisible for entity", entity, data.entities.get(entity, "name"));
	}

	var dw = imageComponent.destinationWidth || data.entities.get(entity, "size").width || image.width;
	if (dw === 0) {
		console.warn("destinationWidth is 0, image would be invisible for entity", entity, data.entities.get(entity, "name"));
	}
	var dh = imageComponent.destinationHeight || data.entities.get(entity, "size").height || image.height;
	if (dh === 0) {
		console.warn("destinationHeight is 0, image would be invisible for entity", entity, data.entities.get(entity, "name"));
	}

	try {
		var position = data.entities.get(entity, "position");
		var dx2 = dx + position.x;
		var dy2 = dy + position.y;

		var rotation = data.entities.get(entity, "rotation");
		if (rotation !== undefined) {
			context.save();

			var x = position.x + rotation.x;
			var y = position.y + rotation.y;
			context.translate(x, y);
			context.rotate(rotation.angle);

			dx2 = dx - rotation.x;
			dy2 = dy - rotation.y;
		}

		context.drawImage(image, sx, sy, sw, sh, dx2, dy2, dw, dh);

		if (rotation !== undefined) {
			context.restore();
		}
	} catch (e) {
		console.error("Error drawing image", imageComponent.name, e);
	}
}

module.exports = function(ecs, data) {
	data.entities.registerSearch("drawImage", ["image", "position"]);
	ecs.add(function drawImage(entities, context) {
		var ids = entities.find("drawImage");
		ids.sort(function(a, b) {
			var za = (entities.get(a, "zindex") || { zindex: 0 }).zindex;
			var zb = (entities.get(b, "zindex") || { zindex: 0 }).zindex;
			var ya = (entities.get(a, "position") || { y: 0 }).y;
			var yb = (entities.get(b, "position") || { y: 0 }).y;
			return za - zb || ya - yb;
		});

		for (var i = 0; i < ids.length; i++) {
			drawEntity(data, ids[i], context);
		}
	});
};
