"use strict";

var buildBuffer = require("./gl/build-buffer");

function fromImage(gl, image) {
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);
	texture.width = image.width;
	texture.height = image.height;
	return texture;
}

function toSprites(gl, texture, json) {
	return json.frames.reduce(function(sprites, frame) {
		var left = frame.frame.x / texture.width;
		var top = 1.0 - (frame.frame.y / texture.height);
		var right = (frame.frame.x + frame.frame.w) / texture.width;
		var bottom = (texture.height - frame.frame.y - frame.frame.h) / texture.height;
		sprites[frame.filename] = {
			texture: texture,
			textureCoords: buildBuffer(gl, 2, [
				right, top,
				left, top,
				right, bottom,
				left, bottom
			]),
			width: frame.frame.w,
			height: frame.frame.h
		};

		return sprites;
	}, {});
}

module.exports = {
	fromImage: fromImage,
	toSprites: toSprites
};
