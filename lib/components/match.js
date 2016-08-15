module.exports = {
  factory: function() {
    return {
      matchX: 0,
      matchY: 0,
      matchZ: 0
    };
  },
  reset: function(match) {
    delete match.id;
    match.matchX = 0;
    match.matchY = 0;
    match.matchZ = 0;
  }
};
