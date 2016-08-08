"use strict";

var clone = require("./clone");
var ECS = require("entity-component-system").EntityComponentSystem;
var EntityPool = require("entity-component-system").EntityPool;

function Scene(name, globals) {
  this.data = {};
  this.entities = new EntityPool();
  this.globals = globals;
  this.name = name;
  this.onEnter = function() {};
  this.onExit = function() {};
  this.renderer = new ECS();
  this.state = "stopped";
  this.speed = 1.0;
  this.simulation = new ECS();
  this.simulationStepTime = 5;

  this.firstTime = true;
  this.accumTime = 0;

  var sceneData = globals.require("./data/scenes")[name];
  if (typeof sceneData.onEnter === "string") {
    this.onEnter = globals.require(sceneData.onEnter);
  }
  if (typeof sceneData.onExit === "string") {
    this.onExit = globals.require(sceneData.onExit);
  }
}
Scene.prototype.start = function(sceneArgs) {
  if (this.state !== "stopped") {
    return;
  }
  this.state = "starting";
  this.entities = new EntityPool();
  this.firstTime = true;
  this.accumTime = 0;

  this.data = {
    animations: this.globals.animations,
    arguments: sceneArgs || {},
    canvas: this.globals.canvas,
    context: this.globals.context,
    entities: this.entities,
    images: this.globals.images,
    inputs: this.globals.inputs,
    prefabs: this.globals.prefabs,
    require: this.globals.require,
    scaleCanvasToCssSize: this.globals.scaleCanvasToCssSize,
    scaleCanvasToFitRectangle: this.globals.scaleCanvasToFitRectangle,
    scenes: this.globals.scenes,
    sounds: this.globals.sounds,
    switchScene: this.switchScene.bind(this)
  };

  this.simulation.add(function processInputUpdates() {
    this.globals.inputs.processUpdates();
  }.bind(this));

  var systems = this.globals.require("./data/systems");
  this.installSystems(systems.simulation, this.simulation, this.data);
  this.installSystems(systems.renderer, this.renderer, this.data);

  var entities = this.globals.require("./data/entities");
  this.entities.load(clone(entities[this.name]) || []);

  this.onEnter(this.data);
};
Scene.prototype.stop = function() {
  if (this.state === "stopped") {
    return;
  }
  this.state = "stopped";
  this.onExit(this.data);
};
Scene.prototype.switchScene = function(scene, sceneArgs) {
  this.stop();
  this.data.scenes[scene].start(sceneArgs);
};
Scene.prototype.installSystems = function(systems, ecs, data) {
  for (var i = 0; i < systems.length; i++) {
    var system = systems[i];

    if (system.scenes.indexOf(this.name) === -1 && system.scenes !== "all") {
      continue;
    }
    var script = this.globals.require(system.name);
    if (script === undefined) {
      console.error("failed to load script", system.name);
    }
    script(ecs, data);
  }
};
Scene.prototype.simulate = function(elapsed) {
  if (this.state === "stopped") {
    return;
  }
  this.state = "started";

  if (this.firstTime) {
    this.firstTime = false;
    // run simulation the first time, because not enough time will have elapsed
    this.simulation.run(this.entities, 0);
  }

  elapsed *= this.speed;

  this.accumTime += elapsed;
  while (this.accumTime >= this.simulationStepTime) {
    this.accumTime -= this.simulationStepTime;
    this.simulation.run(this.entities, this.simulationStepTime);
  }
};
Scene.prototype.render = function(elapsed) {
  if (this.state !== "started") {
    return;
  }
  this.renderer.run(this.entities, elapsed);
};

module.exports = Scene;
