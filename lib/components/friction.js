"use strict";

/**
 * The speed modifier of an entity in the game world. Each frame the speed is multiplied by the friction.
 * @typedef {Object} friction
 * @memberof Components
 * @property {float} x - The amount to modify the velocity of this entity along the x-axis.
 * @property {float} y - The amount to modify the velocity of this entity along the y-axis.
 */
module.exports = {
  factory: function() {
    return {
      x: 1,
      y: 1
    };
  },
  reset: function(friction) {
    friction.x = 1;
    friction.y = 1;
  }
};
