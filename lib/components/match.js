
module.exports = {
  factory: function() {
    return {
      id: undefined,
      matchX: 0,
      matchY: 0,
      matchZ: 0
    };
  },
  reset: function(match) {
    match.id = undefined;
    match.matchX = 0;
    match.matchY = 0;
    match.matchZ = 0;
  }
};
