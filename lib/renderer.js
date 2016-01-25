"use strict";

var buildBuffer = require("./gl/build-buffer");
var mat4 = require("gl-matrix").mat4;
var object = require("./object");
var shaders = require("./shaders");
var textures = require("./textures");
var TextRenderer = require("./text-renderer");

function Renderer(gl) {
	this.gl = gl;
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	this.gl.enable(this.gl.BLEND);
	this.camera = mat4.create();
	this.mvMatrix = mat4.create();
	this.textRenderer = new TextRenderer(this.gl);
}
Renderer.prototype.loadSprites = function(textureManifests, images) {
	this.sprites = object.values(textureManifests).reduce(function(sprites, textureManifest) {
		var image = textureManifest.meta.image;
		var t = textures.fromImage(this.gl, images.get(image));
		var s = textures.toSprites(this.gl, t, textureManifest);
		object.merge(sprites, s);
		return sprites;
	}.bind(this), {});
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
	this.sprites["text"] = this.textRenderer.fillText(text, x, y, this.font, this.fillStyle);
	this.drawSprite("text", x, y);
};
Renderer.prototype.measureText = function(text) {
	return this.textRenderer.measureText(text, this.font, this.fillStyle);
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
