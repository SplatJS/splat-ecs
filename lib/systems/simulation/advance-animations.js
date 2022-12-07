function setOwnPropertiesDeep(src, dest) {
  var props = Object.keys(src);
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    var val = src[prop];
    if (typeof val === "object") {
      if (!dest[prop]) {
        dest[prop] = {};
      }
      setOwnPropertiesDeep(val, dest[prop]);
    } else {
      dest[prop] = val;
    }
  }
}

function applyAnimation(entity, a, animation, entities) {
  a.lastName = a.name; // track the old name so we can see if it changes
  Object.keys(animation[a.frame].properties).forEach(function(property) {
    var dest = entities.getComponent(entity, property);
    if (!dest) {
      dest = entities.addComponent(entity, property);
    }
    setOwnPropertiesDeep(animation[a.frame].properties[property], dest);
  });
}

module.exports = function(ecs, game) {
  game.entities.onAddComponent("animation", function(entity, component, a) {
    var animation = game.animations[a.name];
    if (!animation) {
      return;
    }
    applyAnimation(entity, a, animation, game.entities);
  });
  ecs.addEach(function advanceAnimations(entity, elapsed) {
    var a = game.entities.getComponent(entity, "animation");
    var animation = game.animations[a.name];
    if (!animation) {
      return;
    }
    if (a.name != a.lastName) {
      a.frame = 0;
      a.time = 0;
    }
    a.time += elapsed * a.speed;
    var lastFrame = a.frame;
    while (a.time > animation[a.frame].time) {
      a.time -= animation[a.frame].time;
      a.frame++;
      if (a.frame >= animation.length) {
        if (a.loop) {
          a.frame = 0;
        } else {
          a.frame--;
        }
      }
    }
    if (lastFrame != a.frame || a.name != a.lastName) {
      applyAnimation(entity, a, animation, game.entities);
    }
  }, "animation");
};
