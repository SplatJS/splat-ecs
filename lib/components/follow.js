module.exports = {
  factory: function() {
    return {
      id: undefined,
      distance: 0
    };
  },
  reset: function(follow) {
    follow.id = undefined;
    follow.distance = 0;
  }
};
