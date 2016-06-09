"use strict";

var timeAccumulator = require("time-accumulator");

module.exports = function(entities, simulation, simulationStepTime, renderer, context) {
  var run = timeAccumulator(simulationStepTime);
  var timeDelta = require("./absolute-to-relative")();
  var running = true;
  var stopCallback = function() {};

  // run simulation the first time, because not enough time will have elapsed
  simulation.run(entities, 0);

  var remainingDebugTime;
  window.timeSystems = function(total) {
    simulation.resetTimings();
    renderer.resetTimings();
    remainingDebugTime = total;
  };
  function trackDebugTiming(elapsed) {
    if (remainingDebugTime === undefined) {
      return;
    }
    remainingDebugTime -= elapsed;
    if (remainingDebugTime > 0) {
      return;
    }
    remainingDebugTime = undefined;

    var timings = simulation.timings().concat(renderer.timings());
    var total = timings.map(function(timing) {
      return timing.time;
    }).reduce(function(a, b) {
      return a + b;
    });
    timings.sort(function(a, b) {
      return b.time - a.time;
    }).forEach(function(timing) {
      timing.percent = timing.time / total;
    });
    console.table(timings);
  }

  function render(time) {
    var elapsed = timeDelta(time);
    run(elapsed, function(elapsed) {
      simulation.run(entities, elapsed);
    });

    context.save();
    renderer.run(entities, elapsed);
    context.restore();

    trackDebugTiming(elapsed);

    if (running) {
      window.requestAnimationFrame(render);
    } else {
      stopCallback();
    }
  }
  window.requestAnimationFrame(render);

  return function(callback) {
    running = false;
    stopCallback = callback;
  };
};
