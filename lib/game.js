"use strict";

var ImageLoader = require("./image-loader");
var Input = require("./input");
var object = require("./object");
var path = require("path");
var Renderer = require("./renderer");
var Scene = require("./scene");
var SoundLoader = require("./sound-loader");


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
		var newFrame = object.clone(firstFrame);
		newFrame.properties.image.sourceX = frameWidth * i;
		newFrame.properties.image.sourceWidth = frameWidth;
		animations[key].push(newFrame);
	}
	animations[key].splice(0,1);
}

function loadTextureManifests(customRequire) {
	var textureList = customRequire("./data/textures");
	return textureList.reduce(function(manifests, path) {
		manifests[path] = customRequire(path);
		return manifests;
	}, {});
}
function buildImageManifest(textureManifests) {
	return Object.keys(textureManifests).reduce(function(imageManifest, textureDataPath) {
		var textureManifest = textureManifests[textureDataPath];
		var image = textureManifest.meta.image;
		imageManifest[image] = path.resolve(path.dirname(textureDataPath), image);
		return imageManifest;
	}, {});
}
function loadShaderManifest(customRequire) {
	var shaders = customRequire("./data/shaders");
	Object.keys(shaders).forEach(function(name) {
		shaders[name].shaders.forEach(function(shader) {
			shader.text = customRequire(shader.path);
		});
	});
	return shaders;
}

function Game(canvas, customRequire) {
	this.animations = customRequire("./data/animations");
	splitFilmStripAnimations(this.animations);
	this.canvas = canvas;
	this.context = canvas.getContext("webgl");

	this.entities = customRequire("./data/entities");

	this.textureManifests = loadTextureManifests(customRequire);
	var imageManifest = buildImageManifest(this.textureManifests);
	this.images = new ImageLoader();
	this.images.loadFromManifest(imageManifest);

	this.input = new Input(customRequire("./data/inputs"), canvas);
	this.prefabs = customRequire("./data/prefabs");
	this.require = customRequire;
	this.scenes = customRequire("./data/scenes");
	this.shaders = loadShaderManifest(customRequire);
	this.sounds = new SoundLoader();
	this.sounds.loadFromManifest(customRequire("./data/sounds"));
	this.systems = customRequire("./data/systems");

	this.scaleCanvasToCssSize();
	window.addEventListener("resize", this.onCanvasResize.bind(this));

	this.startLoadingScene();
}
Game.prototype.firstScene = function() {
	var scenes = Object.keys(this.scenes);
	for (var i = 0; i < scenes.length; i++) {
		var name = scenes[i];
		if (this.scenes[name].first) {
			return name;
		}
	}
};
Game.prototype.startLoadingScene = function() {
	this.scene = new Scene();
	this.scene.renderer.add(function() {
		// context.fillStyle = "#000000";
		// context.fillRect(0, 0, canvas.width, canvas.height);

		// var quarterWidth = Math.floor(canvas.width / 4);
		// var halfWidth = Math.floor(canvas.width / 2);
		// var halfHeight = Math.floor(canvas.height / 2);

		// context.fillStyle = "#ffffff";
		// context.fillRect(quarterWidth, halfHeight - 15, halfWidth, 30);

		// context.fillStyle = "#000000";
		// context.fillRect(quarterWidth + 3, halfHeight - 12, halfWidth - 6, 24);

		// context.fillStyle = "#ffffff";
		// var barWidth = (halfWidth - 6) * percentLoaded();
		// context.fillRect(quarterWidth + 3, halfHeight - 12, barWidth, 24);

		if (this.percentLoaded() === 1) {
			this.switchScene(this.firstScene());
		}
	}.bind(this));
	this.scene.start();
};
Game.prototype.percentLoaded = function() {
	if (this.images.totalImages + this.sounds.totalSounds === 0) {
		return 1;
	}
	return (this.images.loadedImages + this.sounds.loadedSounds) / (this.images.totalImages + this.sounds.totalSounds);
};
Game.prototype.makeScene = function(name, sceneData, sceneArgs) {
	var scene = new Scene();

	var renderer = new Renderer(this.context);
	renderer.loadSprites(this.textureManifests, this.images);
	renderer.buildShaderProgram(this.shaders, name);
	renderer.setSize(this.canvas.width, this.canvas.height);
	this.renderer = renderer;

	var data = this.makeSceneData(scene.entities, sceneArgs);
	data.renderer = renderer;

	scene.simulation.add(function() {
		data.input.processUpdates();
	});
	this.installSystems(name, this.systems.simulation, scene.simulation, data);
	this.installSystems(name, this.systems.renderer, scene.renderer, data);
	scene.entities.load(object.clone(this.entities[name]));

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
		input: this.input,
		require: this.require,
		scaleCanvasToCssSize: this.scaleCanvasToCssSize.bind(this),
		scaleCanvasToFitRectangle: this.scaleCanvasToFitRectangle.bind(this),
		sounds: this.sounds,
		sprites: this.sprites,
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
	if (this.scenes[name] === undefined) {
		console.error("No such scene:", name);
		return;
	}
	var start = function() {
		this.scene = this.makeScene(name, this.scenes[name], sceneArgs);
		this.scene.start(this.context);
	}.bind(this);
	if (this.scene !== undefined) {
		this.scene.stop(function() {
			start();
		}.bind(this));
	} else {
		start();
	}
};
Game.prototype.onCanvasResize = function() {
	this.resizer();
	if (this.renderer) {
		this.renderer.setSize(this.canvas.width, this.canvas.height);
	}
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
		this.scene.entities.set(id, key, object.clone(prefab[key]));
	}.bind(this));
	return id;
};

module.exports = Game;
