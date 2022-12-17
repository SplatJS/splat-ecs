import clone from "./clone";
import components from "./components";
import {
  EntityComponentSystem as ECS,
  EntityPool,
} from "entity-component-system";
import registerComponents from "./components/register";

function Scene(name, globals) {
  this.data = {};
  this.entities = new EntityPool();
  this.globals = globals;
  this.name = name;
  this.onEnter = function () {};
  this.onExit = function () {};
  this.renderer = new ECS();
  this.state = "stopped";
  this.speed = 1.0;
  this.simulation = new ECS();
  this.simulationStepTime = 5;

  this.firstTime = true;
  this.accumTime = 0;

  this.sceneConfig = globals.require("./data/scenes")[name];
  if (typeof this.sceneConfig.onEnter === "string") {
    this.onEnter =
      globals.require(this.sceneConfig.onEnter).default ||
      globals.require(this.sceneConfig.onEnter);
  }
  if (typeof this.sceneConfig.onExit === "string") {
    this.onExit =
      globals.require(this.sceneConfig.onExit).default ||
      globals.require(this.sceneConfig.onEnter);
  }
}
Scene.prototype.start = function (sceneArgs) {
  if (this.state !== "stopped") {
    return;
  }
  this.state = "starting";
  this.tempArguments = sceneArgs;
};
Scene.prototype._initialize = function () {
  this.entities = new EntityPool();
  this.firstTime = true;
  this.accumTime = 0;

  this.data = {
    animations: this.globals.animations,
    arguments: this.tempArguments || {},
    canvas: this.globals.canvas,
    context: this.globals.context,
    entities: this.entities,
    images: this.globals.images,
    inputs: this.globals.inputs,
    prefabs: this.globals.prefabs,
    require: this.globals.require,
    scaleCanvasToCssSize: this.globals.scaleCanvasToCssSize,
    scaleCanvasToFitRectangle: this.globals.scaleCanvasToFitRectangle,
    sceneConfig: this.sceneConfig,
    scenes: this.globals.scenes,
    sounds: this.globals.sounds,
    switchScene: this.switchScene.bind(this),
  };

  this.simulation = new ECS();
  this.renderer = new ECS();
  this.simulation.add(
    function processInputUpdates() {
      this.globals.inputs.processUpdates();
    }.bind(this)
  );

  var systems = this.globals.require("./data/systems");
  this.installSystems(systems.simulation, this.simulation, this.data);
  this.installSystems(systems.renderer, this.renderer, this.data);

  registerComponents(this.entities, components);
  registerComponents(this.entities, this.globals.require("./data/components"));
  var entities = this.globals.require("./data/entities");
  this.entities.load(clone(entities[this.name]) || []);
  this.onEnter(this.data);
};
Scene.prototype.stop = function () {
  if (this.state === "stopped") {
    return;
  }
  this.state = "stopped";
  this.onExit(this.data);
};
Scene.prototype.switchScene = function (scene, sceneArgs) {
  this.stop();
  this.data.scenes[scene].start(sceneArgs);
};
Scene.prototype.installSystems = function (systems, ecs, data) {
  for (var i = 0; i < systems.length; i++) {
    var system = systems[i];

    if (system.scenes.indexOf(this.name) === -1 && system.scenes !== "all") {
      continue;
    }
    var script = this.globals.require(system.name).default;
    if (script === undefined) {
      console.error("failed to load script", system.name);
    }
    script(ecs, data);
  }
};
Scene.prototype.simulate = function (elapsed) {
  if (this.state === "stopped") {
    return;
  }
  if (this.state === "starting") {
    var start = window.performance.now();
    this._initialize();
    var end = window.performance.now();
    this.accumTime = start - end; // negative so a long initialize doesn't make the first few frames slow
    this.state = "started";
  }

  if (this.firstTime) {
    this.firstTime = false;
    // run simulation the first time, because not enough time will have elapsed
    this.simulation.run(this.entities, 0);
    elapsed = 0;
  }

  elapsed *= this.speed;

  this.accumTime += elapsed;
  while (this.accumTime >= this.simulationStepTime) {
    this.accumTime -= this.simulationStepTime;
    this.simulation.run(this.entities, this.simulationStepTime);
  }
};
Scene.prototype.render = function (elapsed) {
  if (this.state !== "started") {
    return;
  }
  this.renderer.run(this.entities, elapsed);
};

export default Scene;
