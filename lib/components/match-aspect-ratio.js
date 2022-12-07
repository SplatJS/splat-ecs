module.exports = {
  factory: function() {
    return {};
  },
  reset: function(matchAspectRatio) {
    delete matchAspectRatio.id;
  }
};
