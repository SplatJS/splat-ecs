"use strict";

var buildBuffer = require("./gl/build-buffer");
var mat4 = require("gl-matrix").mat4;
var object = require("./object");
var shaders = require("./shaders");
var textures = require("./textures");

function Renderer(gl) {
	this.gl = gl;
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	this.gl.enable(this.gl.BLEND);
	this.camera = mat4.create();
	this.mvMatrix = mat4.create();
}
Renderer.prototype.loadSprites = function(textureManifests, images) {
	this.sprites = object.values(textureManifests).reduce(function(sprites, textureManifest) {
		var image = textureManifest.meta.image;
		var t = textures.fromImage(this.gl, images.get(image));
		var s = textures.toSprites(this.gl, t, textureManifest);
		object.merge(sprites, s);
		return sprites;
	}.bind(this), {});

	this.font = "10px sans-serif";
	this.fillStyle = "#000000";
	this.lastText = "";
	this.textCanvas = require("./buffer").makeCanvas(2048, 2048);
	this.textContext = this.textCanvas.getContext("2d");
	this.textContext.textBaseline = "top";
	var top = 0;
	var left = 0;
	var bottom = 1;
	var right = 1;
	this.sprites["text"] = {
		textureCoords: buildBuffer(this.gl, 2, [
			right, top,
			left, top,
			right, bottom,
			left, bottom
		]),
		width: this.textCanvas.width,
		height: this.textCanvas.height
	};
};
Renderer.prototype.buildShaderProgram = function(shaderManifest, scene) {
	var compiled = shaderManifest.shaders.filter(function(shader) {
		return shader.scenes.indexOf(scene) !== -1;
	}).map(function(shader) {
		return shaders.compile(this.gl, shader.type, shader.text);
	}.bind(this));
	this.shaderProgram = shaders.link(this.gl, compiled, shaderManifest.vertexAttribArrays, shaderManifest.uniformVars);
};
Renderer.prototype.setSize = function(w, h) {
	this.gl.viewport(0, 0, w, h);

	var pMatrix = mat4.create();
	mat4.ortho(pMatrix, 0, w, h, 0, -1, 1);
	this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
};
Renderer.prototype.setCamera = function(x, y) {
	mat4.identity(this.camera);
	mat4.translate(this.camera, this.camera, [-x, -y, 0.0]);
};
Renderer.prototype.drawSprite = function(name, x, y, dw, dh) {
	var sprite = this.sprites[name];
	if (!sprite) {
		return;
	}

	dw = dw || sprite.width;
	dh = dh || sprite.height;

	var vertexCoords = buildBuffer(this.gl, 3, makeRectangleCoords(dw, dh));
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexCoords);
	this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, vertexCoords.itemSize, this.gl.FLOAT, false, 0, 0);

	var coords = sprite.textureCoords;
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, coords);
	this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, coords.itemSize, this.gl.FLOAT, false, 0, 0);
	this.gl.activeTexture(this.gl.TEXTURE0);
	this.gl.bindTexture(this.gl.TEXTURE_2D, sprite.texture);
	this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);

	mat4.translate(this.mvMatrix, this.camera, [x, y, 0.0]);
	this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);

	this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, vertexCoords.numItems);
};
Renderer.prototype.fillText = function(text, x, y) {
	if (text != this.lastText
		|| this.textContext.font != this.font
		|| this.textContext.fillStyle != this.fillStyle) {
		this.lastText = text;
		this.textContext.font = this.font;
		this.textContext.fillStyle = this.fillStyle;
		this.textContext.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
		this.textContext.fillText(text, 0, 0);
		this.sprites["text"].texture = textures.fromImage(this.gl, this.textCanvas, false);
	}

	this.drawSprite("text", x, y, this.textCanvas.width, this.textCanvas.height);
};
Renderer.prototype.measureText = function(text) {
	this.textContext.font = this.font;
	this.textContext.fillStyle = this.fillStyle;
	return this.textContext.measureText(text);
};

function makeRectangleCoords(w, h) {
	var c = [
		w,  0.0,  0.0, // top right
		0.0,  0.0,  0.0, // top left
		w, h,  0.0, // bottom right
		0.0, h,  0.0 // bottom left
	];
	return c;
}

module.exports = Renderer;
