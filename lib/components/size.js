/**
 * The size of an entity in the game world.
 * @typedef {Object} size
 * @memberof Components
 * @property {float} width - The width of this entity rightward from {@link Components.position} along the x-axis.
 * @property {float} height - The height of this entity downward from {@link Components.position} along the y-axis.
 */

module.exports = {
  factory: function() {
    return {
      x: 0,
      y: 0
    };
  },
  reset: function(size) {
    size.x = 0;
    size.y = 0;
  }
};
