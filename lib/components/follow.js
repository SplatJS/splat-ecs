module.exports = {
  factory: function() {
    return {
      distance: 0
    };
  },
  reset: function(follow) {
    delete follow.id;
    follow.distance = 0;
  }
};
