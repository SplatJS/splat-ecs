"use strict";

function drawEntity(game, entity, pMatrix, mvMatrix, camera) {
	var imageComponent = game.entities.get(entity, "image");

	var image = imageComponent.buffer;
	if (!image) {
		image = game.sprites[imageComponent.name];
	}
	if (!image) {
		console.error("No such image", imageComponent.name, "for entity", entity, game.entities.get(entity, "name"));
		return;
	}

	mat4.copy(mvMatrix, camera);
	var position = game.entities.get(entity, "position");

	mat4.translate(mvMatrix, mvMatrix, [position.x, position.y, 0.0]);
	drawSprite(game.context, game.shaders, image, pMatrix, mvMatrix);

	// FIXME: disable these checks/warnings in production version

	// var sx = imageComponent.sourceX || 0;
	// var sy = imageComponent.sourceY || 0;

	// var dx = imageComponent.destinationX || 0;
	// var dy = imageComponent.destinationY || 0;

	// var size = game.entities.get(entity, "size") || { "width": 0, "height": 0 };

	// var sw = imageComponent.sourceWidth || image.width;
	// if (sw === 0) {
	// 	console.warn("sourceWidth is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
	// }
	// var sh = imageComponent.sourceHeight || image.height;
	// if (sh === 0) {
	// 	console.warn("sourceHeight is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
	// }

	// var dw = imageComponent.destinationWidth || size.width || image.width;
	// if (dw === 0) {
	// 	console.warn("destinationWidth is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
	// }
	// var dh = imageComponent.destinationHeight || size.height || image.height;
	// if (dh === 0) {
	// 	console.warn("destinationHeight is 0, image would be invisible for entity", entity, game.entities.get(entity, "name"));
	// }


	// try {
	// 	var position = game.entities.get(entity, "position");

	// 	var dx2 = dx + position.x;
	// 	var dy2 = dy + position.y;

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

	// 	context.drawImage(image, sx, sy, sw, sh, dx2, dy2, dw, dh);

	// 	if (rotation !== undefined) {
	// 		// context.restore();
	// 	}
	// } catch (e) {
	// 	console.error("Error drawing image", imageComponent.name, e);
	// }
}

var mat4 = require("gl-matrix").mat4;

var cx = 0.0;
var cy = 0.0;

function drawSprite(gl, shaderProgram, sprite, pMatrix, mvMatrix) {
	if (!sprite) {
		return;
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, sprite.vertexCoords);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sprite.vertexCoords.itemSize, gl.FLOAT, false, 0, 0);

	var coords = sprite.textureCoords;
	gl.bindBuffer(gl.ARRAY_BUFFER, coords);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, coords.itemSize, gl.FLOAT, false, 0, 0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, sprite.texture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, sprite.vertexCoords.numItems);
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

		game.context.viewport(0, 0, game.canvas.width, game.canvas.height);
		game.context.clear(game.context.COLOR_BUFFER_BIT | game.context.DEPTH_BUFFER_BIT);
		var pMatrix = mat4.create();
		mat4.ortho(pMatrix, 0, game.canvas.width, game.canvas.height, 0, -1, 1);

		var camera = mat4.create();
		mat4.translate(camera, camera, [-cx, -cy, 0.0]);
		var mvMatrix = mat4.create();

		for (var i = 0; i < ids.length; i++) {
			drawEntity(game, ids[i], pMatrix, mvMatrix, camera);
		}
	});
};
