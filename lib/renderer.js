"use strict";

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
	this.shaderPrograms = Object.keys(shaderManifest).reduce(function(programs, name) {
		var compiled = shaderManifest[name].shaders.filter(function(shader) {
			return shader.scenes.indexOf(scene) !== -1;
		}).map(function(shader) {
			return shaders.compile(this.gl, shader.type, shader.text);
		}.bind(this));
		programs[name] = shaders.link(this.gl, compiled, shaderManifest[name].vertexAttribArrays, shaderManifest[name].uniformVars);
		return programs;
	}.bind(this), {});
	this.useProgram("sprite");
};
Renderer.prototype.useProgram = function(name) {
	this.shaderProgram = this.shaderPrograms[name];
	this.gl.useProgram(this.shaderProgram);
	this.setSize(this.width, this.height);
};
Renderer.prototype.setSize = function(w, h) {
	this.width = w;
	this.height = h;
	this.gl.viewport(0, 0, w, h);

	var pMatrix = mat4.create();
	mat4.ortho(pMatrix, 0, w, h, 0, -1, 1);
	this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
};
Renderer.prototype.setCamera = function(x, y) {
	mat4.identity(this.camera);
	mat4.translate(this.camera, this.camera, [-x, -y, 0.0]);
};
Renderer.prototype.fillText = function(text, x, y) {
	this.sprites["text"] = this.textRenderer.fillText(text, x, y, this.font, this.fillStyle);
	this.beginSprites(1);
	this.addSprite("text", x, y);
	this.flush();
};
Renderer.prototype.measureText = function(text) {
	return this.textRenderer.measureText(text, this.font, this.fillStyle);
};
Renderer.prototype.fillRect = function() {
};
Renderer.prototype.strokeRect = function(x, y, w, h) {
	this.useProgram("square");
	var coords = new Float32Array([
		x, y, 0.0,         1.0, 0.0, 0.0, 1.0, // top left
		x + w, y, 0.0,     1.0, 0.0, 0.0, 1.0, // top right
		x + w, y + h, 0.0, 1.0, 0.0, 0.0, 1.0, // bottom right
		x, y + h, 0.0,     1.0, 0.0, 0.0, 1.0  // bottom left
	]);
	this.gl.uniformMatrix4fv(this.shaderPrograms.square.mvMatrixUniform, false, this.camera);

	var buffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, coords, this.gl.STATIC_DRAW);

	this.gl.vertexAttribPointer(this.shaderPrograms.square.vertexPositionAttribute, 3, this.gl.FLOAT, false, coords.BYTES_PER_ELEMENT * 7, 0);
	this.gl.enableVertexAttribArray(this.shaderPrograms.square.vertexPositionAttribute);

	this.gl.vertexAttribPointer(this.shaderPrograms.square.vertexColorAttribute, 4, this.gl.FLOAT, false, coords.BYTES_PER_ELEMENT * 7, coords.BYTES_PER_ELEMENT * 3);
	this.gl.enableVertexAttribArray(this.shaderPrograms.square.vertexColorAttribute);

	this.gl.drawArrays(this.gl.LINE_LOOP, 0, 4);
};
Renderer.prototype.beginSprites = function(numSprites) {
	this.useProgram("sprite");
	var size = numSprites * 30;
	if (this.spriteCoords === undefined || size > this.spriteCoords.length) {
		this.spriteCoords = new Float32Array(numSprites * 30);
	}
	this.currSprite = 0;
};
Renderer.prototype.addSprite = function(name, x, y, dw, dh) {
	var sprite = this.sprites[name];
	if (!sprite) {
		return;
	}
	this.currTexture = sprite.texture;

	dw = dw || sprite.width;
	dh = dh || sprite.height;

	this.spriteCoords.set([
		x + dw, y, 0.0, sprite.textureCoords.right, sprite.textureCoords.top, // top right
		x, y, 0.0, sprite.textureCoords.left, sprite.textureCoords.top, // top left
		x + dw, y + dh, 0.0, sprite.textureCoords.right, sprite.textureCoords.bottom, // bottom right

		x, y, 0.0, sprite.textureCoords.left, sprite.textureCoords.top, // top left
		x + dw, y + dh, 0.0, sprite.textureCoords.right, sprite.textureCoords.bottom, // bottom right
		x, y + dh, 0.0, sprite.textureCoords.left, sprite.textureCoords.bottom // bottom left
	], this.currSprite * 30);
	this.currSprite++;
};
Renderer.prototype.flush = function() {
	this.gl.activeTexture(this.gl.TEXTURE0);
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.currTexture);
	this.gl.uniform1i(this.shaderPrograms.sprite.samplerUniform, 0);

	this.gl.uniformMatrix4fv(this.shaderPrograms.sprite.mvMatrixUniform, false, this.camera);

	var buffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, this.spriteCoords, this.gl.STATIC_DRAW);

	this.gl.vertexAttribPointer(this.shaderPrograms.sprite.vertexPositionAttribute, 3, this.gl.FLOAT, false, this.spriteCoords.BYTES_PER_ELEMENT * 5, 0);
	this.gl.enableVertexAttribArray(this.shaderPrograms.sprite.vertexPositionAttribute);

	this.gl.vertexAttribPointer(this.shaderPrograms.sprite.textureCoordAttribute, 2, this.gl.FLOAT, false, this.spriteCoords.BYTES_PER_ELEMENT * 5, this.spriteCoords.BYTES_PER_ELEMENT * 3);
	this.gl.enableVertexAttribArray(this.shaderPrograms.sprite.textureCoordAttribute);

	this.gl.drawArrays(this.gl.TRIANGLES, 0, this.currSprite * 6);

	delete this.currSprite;
	delete this.currTexture;
};

module.exports = Renderer;
