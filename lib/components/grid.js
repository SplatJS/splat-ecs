module.exports = {
  factory: function() {
    return {
      x: 0,
      y: 0,
      z: 0
    };
  },
  reset: function(grid) {
    grid.x = 0;
    grid.y = 0;
    grid.z = 0;
  }
};
