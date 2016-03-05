"use strict";

var Gamepad = require("html5-gamepad");
var Keyboard = require("game-keyboard");
var keyMap = require("game-keyboard/key_map").US;
var keyboard = new Keyboard(keyMap);
var Mouse = require("./mouse");

function Input(config, canvas) {
	this.config = config;
	this.gamepad = new Gamepad();
	this.mouse = new Mouse(canvas);
	this.lastButtonState = {};
	this.delayedButtonUpdates = {};
}
Input.prototype.axis = function(name) {
	var input = this.config.axes[name];
	if (input === undefined) {
		console.error("No such axis: " + name);
		return false;
	}
	for (var i = 0; i < input.length; i++) {
		var physicalInput = input[i];
		var device = physicalInput.device;
		if (device === "mouse") {
			if (physicalInput.axis === "x") {
				return this.mouse.x;
			}
			if (physicalInput.axis === "y") {
				return this.mouse.y;
			}
		}
		if (device === "gamepad") {
			return this.gamepad.axis(0, physicalInput.axis);
		}
	}
};
Input.prototype.button = function(name) {
	var input = this.config.buttons[name];
	if (input === undefined) {
		console.error("No such button: " + name);
		return false;
	}
	for (var i = 0; i < input.length; i++) {
		var physicalInput = input[i];
		var device = physicalInput.device;
		if (device === "keyboard") {
			if (keyboard.isPressed(physicalInput.button)) {
				return true;
			}
		}
		if (device === "mouse") {
			if (this.mouse.isPressed(physicalInput.button)) {
				return true;
			}
		}
		if (device === "gamepad") {
			if (this.gamepad.button(0, physicalInput.button)) {
				return true;
			}
		}
		if (device === "touch") {
			for (var j = 0; j < this.mouse.touches.length; j++) {
				var t = this.mouse.touches[j];
				if (t.x >= physicalInput.x && t.x < physicalInput.x + physicalInput.width && t.y >= physicalInput.y && t.y < physicalInput.y + physicalInput.height) {
					return true;
				}
			}
		}
	}
	return false;
};
Input.prototype.buttonPressed = function(name) {
	var current = this.button(name);
	var last = this.lastButtonState[name];
	if (last === undefined) {
		last = true;
	}
	this.delayedButtonUpdates[name] = current;
	return current && !last;
};
Input.prototype.buttonReleased = function(name) {
	var current = this.button(name);
	var last = this.lastButtonState[name];
	if (last === undefined) {
		last = false;
	}
	this.delayedButtonUpdates[name] = current;
	return !current && last;
};
Input.prototype.processUpdates = function() {
	this.gamepad.update();
	Object.keys(this.delayedButtonUpdates).forEach(function(name) {
		this.lastButtonState[name] = this.delayedButtonUpdates[name];
		delete this.delayedButtonUpdates[name];
	}.bind(this));
};

module.exports = Input;
