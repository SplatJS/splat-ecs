"use strict";

var Input = require("./input");
var Scene = require("./scene");

function clone(obj) {
	if (obj === undefined) {
		return undefined;
	}
	return JSON.parse(JSON.stringify(obj));
}
function splitFilmStripAnimations(animations) {
	Object.keys(animations).forEach(function(key) {
		var firstFrame = animations[key][0];
		if (firstFrame.filmstripFrames) {
			splitFilmStripAnimation(animations, key);
		}
	});
}
function splitFilmStripAnimation(animations, key) {
	var firstFrame = animations[key][0];
	if (firstFrame.properties.image.sourceWidth % firstFrame.filmstripFrames != 0) {
		console.warn("The \"" + key + "\" animation is " + firstFrame.properties.image.sourceWidth + " pixels wide and that is is not evenly divisible by " + firstFrame.filmstripFrames + " frames.");
	}
	for (var i = 0; i < firstFrame.filmstripFrames; i++) {
		var frameWidth = firstFrame.properties.image.sourceWidth / firstFrame.filmstripFrames;
		var newFrame = clone(firstFrame);
		newFrame.properties.image.sourceX = frameWidth * i;
		newFrame.properties.image.sourceWidth = frameWidth;
		animations[key].push(newFrame);
	}
	animations[key].splice(0,1);
}

function Game(canvas, animations, entities, images, input, require, scenes, sounds, systems, prefabs) {
	splitFilmStripAnimations(animations);
	this.animations = animations;
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.entities = entities;
	this.images = images;
	this.input = new Input(input, canvas);
	this.require = require;
	this.scenes = scenes;
	this.sounds = sounds;
	this.systems = systems;
	this.prefabs = prefabs;

	this.scaleCanvasToCssSize();
	window.addEventListener("resize", this.onCanvasResize.bind(this));

	this.makeScenes(scenes);
}
Game.prototype.makeScenes = function(sceneList) {
	Object.keys(sceneList).forEach(function(scene) {
		if (sceneList[scene].first) {
			this.scene = this.makeScene(scene, sceneList[scene], {});
		}
	}.bind(this));
};
Game.prototype.makeScene = function(name, sceneData, sceneArgs) {
	var scene = new Scene();

	var data = this.makeSceneData(scene.entities, sceneArgs);
	scene.simulation.add(function() {
		data.input.processUpdates();
	});
	this.installSystems(name, this.systems.simulation, scene.simulation, data);
	this.installSystems(name, this.systems.renderer, scene.renderer, data);
	scene.entities.load(clone(this.entities[name]));

	if (typeof sceneData.onEnter === "string") {
		var enterScript = this.require(sceneData.onEnter);
		if (typeof enterScript === "function") {
			enterScript = enterScript.bind(scene, data);
		}
		scene.onEnter = enterScript;
	}
	if (typeof sceneData.onExit === "string") {
		var exitScript = this.require(sceneData.onExit);
		if (typeof exitScript === "function") {
			exitScript = exitScript.bind(scene, data);
		}
		scene.onExit = exitScript;
	}

	return scene;
};
Game.prototype.makeSceneData = function(entities, sceneArgs) {
	return {
		animations: this.animations,
		arguments: sceneArgs || {},
		canvas: this.canvas,
		context: this.context,
		entities: entities,
		images: this.images,
		input: this.input,
		require: this.require,
		scaleCanvasToCssSize: this.scaleCanvasToCssSize.bind(this),
		scaleCanvasToFitRectangle: this.scaleCanvasToFitRectangle.bind(this),
		sounds: this.sounds,
		switchScene: this.switchScene.bind(this),
		instantiatePrefab: this.instantiatePrefab.bind(this)
	};
};
Game.prototype.installSystems = function(scene, systems, ecs, data) {
	systems.forEach(function(system) {
		if (system.scenes.indexOf(scene) === -1) {
			return;
		}
		var script = this.require(system.name);
		if (script === undefined) {
			console.error("failed to load script", system.name);
		}
		script(ecs, data);
	}.bind(this));
};
Game.prototype.switchScene = function(name, sceneArgs) {
	if (this.scene !== undefined) {
		this.scene.stop();
	}
	this.scene = this.makeScene(name, this.scenes[name], sceneArgs);
	this.scene.start(this.context);
};
Game.prototype.onCanvasResize = function() {
	this.resizer();
};
Game.prototype.scaleCanvasToCssSize = function() {
	this.resizer = function() {
		var canvasStyle = window.getComputedStyle(this.canvas);
		var width = parseInt(canvasStyle.width);
		var height = parseInt(canvasStyle.height);
		this.canvas.width = width;
		this.canvas.height = height;
	}.bind(this);
	this.resizer();
};
Game.prototype.scaleCanvasToFitRectangle = function(width, height) {
	this.resizer = function() {
		var canvasStyle = window.getComputedStyle(this.canvas);
		var cssWidth = parseInt(canvasStyle.width);
		var cssHeight = parseInt(canvasStyle.height);
		var cssAspectRatio = cssWidth / cssHeight;

		var desiredWidth = width;
		var desiredHeight = height;
		var desiredAspectRatio = width / height;
		if (desiredAspectRatio > cssAspectRatio) {
			desiredHeight = Math.floor(width / cssAspectRatio);
		} else if (desiredAspectRatio < cssAspectRatio) {
			desiredWidth = Math.floor(height * cssAspectRatio);
		}

		this.canvas.width = desiredWidth;
		this.canvas.height = desiredHeight;
	}.bind(this);
	this.resizer();
};
Game.prototype.instantiatePrefab = function(name) {
	var id = this.scene.entities.create();
	var prefab = this.prefabs[name];
	Object.keys(prefab).forEach(function(key) {
		if (key === "id") {
			return;
		}
		this.scene.entities.set(id, key, clone(prefab[key]));
	}.bind(this));
	return id;
};

module.exports = Game;
