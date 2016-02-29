"use strict";

var ECS = require("entity-component-system").EntityComponentSystem;
var EntityPool = require("entity-component-system").EntityPool;
var gameLoop = require("./game-loop");

function Scene() {
	this.simulation = new ECS();
	this.renderer = new ECS();
	this.entities = new EntityPool();
	this.simulationStepTime = 5;
}
Scene.prototype.start = function(context) {
	if (this._stop) {
		return;
	}
	if (typeof this.onEnter === "function") {
		this._stop = function() {};
		this.onEnter();
		if (this._stop === undefined) {
			return;
		}
	}
	this._stop = gameLoop(this.entities, this.simulation, this.simulationStepTime, this.renderer, context);
};
Scene.prototype.stop = function() {
	if (!this._stop) {
		return;
	}
	this._stop();
	delete this._stop;

	if (typeof this.onExit === "function") {
		this.onExit();
	}
};

module.exports = Scene;
