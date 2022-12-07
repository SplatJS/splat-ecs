/** Align the center of this entity with the center of another entity.
 * @typedef {object} matchCenter
 * @memberof Components
 * @property {int} id - The id of the entity to align to on both the x and y axes.
 * @property {int} x - The id of the entity to align to on the x axis.
 * @property {int} y - The id of the entity to align to on the y axis.
 */

module.exports = {
  factory: function() {
    return {};
  },
  reset: function(matchCenter) {
    delete matchCenter.id;
    delete matchCenter.x;
    delete matchCenter.y;
  }
};
