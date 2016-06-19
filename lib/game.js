"use strict";

var clone = require("./clone");
var AssetLoader = require("./assets/asset-loader");
var loadImage = require("./assets/load-image");
var Input = require("./input");
var Prefabs = require("./prefabs");
var Scene = require("./scene");
var SoundManager = require("./sound-manager");
var splitFilmStripAnimations = require("./split-filmstrip-animations");

function Game(canvas, customRequire) {
  this.animations = customRequire("./data/animations");
  splitFilmStripAnimations(this.animations);
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.entities = customRequire("./data/entities");
  this.images = new AssetLoader(customRequire("./data/images"), loadImage);
  this.inputs = new Input(customRequire("./data/inputs"), canvas);
  this.require = customRequire;
  this.scenes = customRequire("./data/scenes");
  this.sounds = new SoundManager(customRequire("./data/sounds"));
  this.systems = customRequire("./data/systems");
  this.prefabs = new Prefabs(customRequire("./data/prefabs"));

  this.scaleCanvasToCssSize();
  window.addEventListener("resize", this.onCanvasResize.bind(this));

  this.makeScenes(this.scenes);
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
    data.inputs.processUpdates();
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
    inputs: this.inputs,
    require: this.require,
    scaleCanvasToCssSize: this.scaleCanvasToCssSize.bind(this),
    scaleCanvasToFitRectangle: this.scaleCanvasToFitRectangle.bind(this),
    sounds: this.sounds,
    switchScene: this.switchScene.bind(this),
    instantiatePrefab: this.prefabs.instantiate.bind(this.prefabs, entities),
    registerPrefab: this.prefabs.register.bind(this.prefabs),
    registerPrefabs: this.prefabs.registerMultiple.bind(this.prefabs)
  };
};
Game.prototype.installSystems = function(scene, systems, ecs, data) {
  systems.forEach(function(system) {
    if (system.scenes.indexOf(scene) === -1 && system.scenes !== "all") {
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
  var start = function() {
    this.scene = this.makeScene(name, this.scenes[name], sceneArgs);
    this.scene.start(this.context);
  }.bind(this);
  if (this.scene !== undefined) {
    this.scene.stop(function() {
      start();
    });
  } else {
    start();
  }
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

module.exports = Game;
