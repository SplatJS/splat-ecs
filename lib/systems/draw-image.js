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
	try {
		var position = data.entities.get(entity, "position");
		var dx = imageComponent.destinationX + position.x;
		var dy = imageComponent.destinationY + position.y;

		var rotation = data.entities.get(entity, "rotation");
		if (rotation !== undefined) {
			context.save();

			var x = position.x + rotation.x;
			var y = position.y + rotation.y;
			context.translate(x, y);
			context.rotate(rotation.angle);

			dx = imageComponent.destinationX - rotation.x;
			dy = imageComponent.destinationY - rotation.y;
		}

		context.drawImage(
			image,
			imageComponent.sourceX,
			imageComponent.sourceY,
			imageComponent.sourceWidth,
			imageComponent.sourceHeight,
			dx,
			dy,
			imageComponent.destinationWidth,
			imageComponent.destinationHeight
		);

		if (rotation !== undefined) {
			context.restore();
		}
	} catch (e) {
		console.error("Error drawing image", imageComponent.name, e);
	}
}

module.exports = function(ecs, data) {
	data.entities.registerSearch("drawImage", ["image", "position"]);
	ecs.add(function(entities, context) {
		var ids = entities.find("drawImage");
		ids.sort(function(a, b) {
			var za = (entities.get(a, "zindex") || { zindex: 0 }).zindex;
			var zb = (entities.get(b, "zindex") || { zindex: 0 }).zindex;
			var ya = (entities.get(a, "position") || { y: 0 }).y;
			var yb = (entities.get(b, "position") || { y: 0 }).y;
			return za - zb || ya - yb;
		});

		for (var i = 0; i < ids.length; i++) {
			drawEntity(data.images, entities.get(ids[i], "image"), entities.get(ids[i], "position"), context);
		}
	});
};
