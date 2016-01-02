"use strict";

var object = require("./object");
var shaders = require("./shaders");
var textures = require("./textures");

function Renderer(gl) {
	this.gl = gl;
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	this.gl.enable(this.gl.BLEND);
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
// Renderer.prototype.setSize = function(w, h) {
// };

module.exports = Renderer;
