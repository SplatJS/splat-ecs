"use strict";

var buildBuffer = require("./gl/build-buffer");
var textures = require("./textures");

function TextRenderer(gl) {
	this.gl = gl;


	this.lastText = "";
	this.textCanvas = require("./buffer").makeCanvas(2048, 2048);
	this.textContext = this.textCanvas.getContext("2d");
	this.textContext.textBaseline = "top";

	var top = 0;
	var left = 0;
	var bottom = 1;
	var right = 1;
	this.sprite = {
		textureCoords: buildBuffer(this.gl, 2, [
			right, top,
			left, top,
			right, bottom,
			left, bottom
		]),
		width: this.textCanvas.width,
		height: this.textCanvas.height
	};
}
TextRenderer.prototype.fillText = function(text, x, y, font, fillStyle) {
	font = font || "10px sans-serif";
	fillStyle = fillStyle || "#000000";

	if (text != this.lastText
		|| this.textContext.font != font
		|| this.textContext.fillStyle != fillStyle) {
		this.lastText = text;
		this.textContext.font = font;
		this.textContext.fillStyle = fillStyle;
		this.textContext.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
		this.textContext.fillText(text, 0, 0);
		this.sprite.texture = textures.fromImage(this.gl, this.textCanvas, false);
	}

	return this.sprite;
};
TextRenderer.prototype.measureText = function(text, font, fillStyle) {
	font = font || "10px sans-serif";
	fillStyle = fillStyle || "#000000";

	this.textContext.font = this.font;
	this.textContext.fillStyle = this.fillStyle;
	return this.textContext.measureText(text);
};

module.exports = TextRenderer;
