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
  this.running = false;
  this.speed = 1.0;
  this.simulation = new ECS();
  this.simulationStepTime = 5;

  this.lastTime = -1;
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
  if (this.running) {
    return;
  }
  this.running = true;
  this.entities = new EntityPool();
  this.lastTime = -1;
  this.accumTime = 0;

  this.data = {
    animations: this.globals.animations,
    arguments: sceneArgs,
    canvas: this.globals.canvas,
    context: this.globals.context,
    entities: this.entities,
    images: this.globals.images,
    inputs: this.globals.inputs,
    prefabs: this.globals.prefabs,
    require: this.globals.require,
    scenes: this.globals.scenes,
    sounds: this.globals.sounds
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
  if (!this.running) {
    return;
  }
  this.running = false;
  this.onExit(this.data);
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
Scene.prototype.simulate = function(time) {
  if (!this.running) {
    return;
  }

  if (this.lastTime === -1) {
    this.lastTime = time;
    // run simulation the first time, because not enough time will have elapsed
    this.simulation.run(this.entities, 0);
  }
  var elapsed = (time - this.lastTime) * this.speed;
  this.lastTime = time;

  this.accumTime += elapsed;
  while (this.accumTime >= this.simulationStepTime) {
    this.accumTime -= this.simulationStepTime;
    this.simulation.run(this.entities, this.simulationStepTime);
  }
};
Scene.prototype.render = function() {
  if (!this.running) {
    return;
  }
  this.renderer.run(this.entities, 0);
};

module.exports = Scene;
