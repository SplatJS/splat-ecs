/** Align the center of this entity with the center of another entity along the y axis.
 * @typedef {object} matchCenterY
 * @memberof Components
 * @property {int} id - The id of the entity to align to.
 */

module.exports = {
  factory: function() {
    return {
      id: undefined
    };
  },
  reset: function(matchCenterY) {
    matchCenterY.id = undefined;
  }
};
