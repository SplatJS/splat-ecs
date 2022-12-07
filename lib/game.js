import AssetLoader from "./assets/asset-loader";
import loadImage from "./assets/load-image";
import Input from "./input";
import Prefabs from "./prefabs";
import Scene from "./scene";
import SoundManager from "./sound-manager";
import splitFilmStripAnimations from "./split-filmstrip-animations";

function Game(canvas, customRequire) {
  this.animations = customRequire("./data/animations");
  splitFilmStripAnimations(this.animations);
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.images = new AssetLoader(customRequire("./data/images"), loadImage);
  this.inputs = new Input(customRequire("./data/inputs"), canvas);
  this.require = customRequire;
  this.sounds = new SoundManager(customRequire("./data/sounds"));
  this.prefabs = new Prefabs(customRequire("./data/prefabs"));
  this.lastTime = -1;
  this.remainingDebugTime = undefined;

  this.scaleCanvasToCssSize();
  window.addEventListener("resize", this.onCanvasResize.bind(this));

  this.scenes = this.makeScenes(customRequire("./data/scenes"));
  this.run = this.run.bind(this);

  this.timings = [];
  window.timingIdx = -1;
  for (var i = 0; i < 100; i++) {
    this.timings.push({
      elapsed: 0,
      totalTime: 0,
      simulationTime: 0,
      rendererTime: 0,
    });
  }
}
Game.prototype.makeScenes = function (sceneList) {
  var names = Object.keys(sceneList);
  var scenes = {};
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    scenes[name] = new Scene(name, {
      animations: this.animations,
      canvas: this.canvas,
      context: this.context,
      images: this.images,
      inputs: this.inputs,
      prefabs: this.prefabs,
      require: this.require,
      scaleCanvasToCssSize: this.scaleCanvasToCssSize.bind(this),
      scaleCanvasToFitRectangle: this.scaleCanvasToFitRectangle.bind(this),
      scenes: scenes,
      sounds: this.sounds,
    });
    if (sceneList[name].first) {
      scenes[name].start();
    }
  }
  return scenes;
};
Game.prototype.start = function () {
  if (this.running) {
    return;
  }
  this.running = true;
  this.lastTime = -1;
  window.requestAnimationFrame(this.run);
};
Game.prototype.stop = function () {
  this.running = false;
};
Game.prototype.run = function (time) {
  var scenes = Object.keys(this.scenes);

  if (this.lastTime === -1) {
    this.lastTime = time;
  }
  var elapsed = time - this.lastTime;
  this.lastTime = time;

  var simulationStart = window.performance.now();
  for (var i = 0; i < scenes.length; i++) {
    var name = scenes[i];
    var scene = this.scenes[name];
    scene.simulate(elapsed);
  }
  var simulationEnd = window.performance.now();

  for (i = 0; i < scenes.length; i++) {
    name = scenes[i];
    scene = this.scenes[name];
    this.context.save();
    scene.render(elapsed);
    this.context.restore();
  }
  var renderEnd = window.performance.now();

  if (window.timingIdx >= 0) {
    this.timings[window.timingIdx].elapsed = elapsed;
    this.timings[window.timingIdx].simulationTime =
      simulationEnd - simulationStart;
    this.timings[window.timingIdx].rendererTime = renderEnd - simulationEnd;
    this.timings[window.timingIdx].totalTime = renderEnd - simulationStart;
    window.timingIdx++;
  }
  if (window.timingIdx >= this.timings.length) {
    window.timingIdx = -1;
    console.table(this.timings);
  }

  if (this.remainingDebugTime !== undefined) {
    this.remainingDebugTime -= elapsed;
    if (this.remainingDebugTime <= 0) {
      this.remainingDebugTime = undefined;
      this.logDebugTimes();
    }
  }

  if (this.running) {
    window.requestAnimationFrame(this.run);
  }
};
Game.prototype.timeSystems = function (total) {
  var scenes = Object.keys(this.scenes);
  for (var i = 0; i < scenes.length; i++) {
    var name = scenes[i];
    var scene = this.scenes[name];
    scene.simulation.resetTimings();
    scene.renderer.resetTimings();
  }
  this.remainingDebugTime = total;
};
Game.prototype.logDebugTimes = function () {
  var scenes = Object.keys(this.scenes);
  var timings = [];
  for (var i = 0; i < scenes.length; i++) {
    var name = scenes[i];
    var scene = this.scenes[name];
    timings = timings.concat(scene.simulation.timings());
    timings = timings.concat(scene.renderer.timings());
  }
  console.table(groupTimings(timings));
};
function groupTimings(timings) {
  var total = timings
    .map(function (timing) {
      return timing.time;
    })
    .reduce(function (a, b) {
      return a + b;
    });
  timings
    .sort(function (a, b) {
      return b.time - a.time;
    })
    .forEach(function (timing) {
      timing.percent = timing.time / total;
    });
  return timings;
}
Game.prototype.onCanvasResize = function () {
  this.resizer();
};
Game.prototype.scaleCanvasToCssSize = function () {
  this.resizer = function () {
    var canvasStyle = window.getComputedStyle(this.canvas);
    var width = parseInt(canvasStyle.width);
    var height = parseInt(canvasStyle.height);
    this.canvas.width = width;
    this.canvas.height = height;
  }.bind(this);
  this.resizer();
};
Game.prototype.scaleCanvasToFitRectangle = function (width, height) {
  this.resizer = function () {
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

export default Game;
