module.exports = {
  factory: function() {
    return {
      x: 0,
      y: 0
    };
  },
  reset: function(acceleration) {
    acceleration.x = 0;
    acceleration.y = 0;
  }
};
