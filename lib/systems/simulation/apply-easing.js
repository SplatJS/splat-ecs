var easingJS = require("easing-js");

module.exports = function(ecs, game) {
  ecs.addEach(function applyEasing(entity, elapsed) {
    var easing = game.entities.getComponent(entity, "easing");

    var properties = Object.keys(easing);
    for (var i = 0; i < properties.length; i++) {
      var current = easing[properties[i]];
      current.time += elapsed;
      easeProperty(game, entity, properties[i], current);
      if (current.time > current.max) {
        delete easing[properties[i]];
      }
    }
  }, "easing");
};

function easeProperty(game, entity, property, easing) {
  var parts = property.split(".");
  var componentName = parts[0];
  var component = game.entities.getComponent(entity, componentName);
  var partNames = parts.slice(1, parts.length, parts - 1);
  for (var i = 0; i < partNames.length - 1; i++) {
    component = component[partNames[i]];
  }
  var last = parts[parts.length - 1];
  component[last] = easingJS[easing.type](easing.time, easing.start, easing.end - easing.start, easing.max);
}
