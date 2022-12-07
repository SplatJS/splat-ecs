module.exports = {
  factory: function() {
    return {
      current: 0,
      max: 1000
    };
  },
  reset: function(lifeSpan) {
    lifeSpan.current = 0;
    lifeSpan.max = 1000;
  }
};
