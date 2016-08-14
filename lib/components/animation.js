module.exports = {
  factory: function animation() {
    return {
      name: undefined,
      time: 0,
      frame: 0,
      loop: true,
      speed: 1
    };
  },
  reset: function(animation) {
    animation.name = undefined;
    animation.time = 0;
    animation.frame = 0;
    animation.loop = true;
    animation.speed = 1;
  }
};
