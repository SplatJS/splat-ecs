// This component is deprecated and will be removed in the next major version.
// Use box-collider instead.
module.exports = {
  factory: function() {
    return [];
  },
  reset: function(collisions) {
    collisions.length = 0;
  }
};
