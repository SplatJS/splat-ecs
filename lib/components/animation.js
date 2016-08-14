module.exports = {
  factory: function animation() {
    return {
      time: 0,
      frame: 0,
      loop: true,
      speed: 1
    };
  },
  reset: function(animation) {
    delete animation.name;
    animation.time = 0;
    animation.frame = 0;
    animation.loop = true;
    animation.speed = 1;
  }
};
