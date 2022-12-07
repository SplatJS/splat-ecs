/**
 * The speed of an entity in the game world in pixels-per-millisecond.
 * @typedef {Object} velocity
 * @memberof Components
 * @property {float} x - The velocity of this entity along the x-axis.
 * @property {float} y - The velocity of this entity along the y-axis.
 * @property {float} z - The velocity of this entity along the z-axis.
 */

module.exports = {
  factory: function() {
    return {
      x: 0,
      y: 0,
      z: 0
    };
  },
  reset: function(velocity) {
    velocity.x = 0;
    velocity.y = 0;
    velocity.z = 0;
  }
};
