/**
 * The coordinates of an entity in the game world.
 * @typedef {Object} position
 * @memberof Components
 * @property {float} x - The position of this entity along the x-axis.
 * @property {float} y - The position of this entity along the y-axis.
 * @property {float} z - The position of this entity along the z-axis.
 * Since Splat is 2D this is mainly for creating layers when drawing sprites similar to z-index in CSS.
 */

module.exports = {
  factory: function() {
    return {
      x: 0,
      y: 0,
      z: 0
    };
  },
  reset: function(position) {
    position.x = 0;
    position.y = 0;
    position.z = 0;
  }
};
