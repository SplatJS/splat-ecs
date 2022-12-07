/**
 * An entity to keep this entity inside of another
 * @typedef {Object} constrainPosition
 * @memberof Components
 * @property {float} id - The id of a target entity to keep this entity inside of
 */
module.exports = {
  factory: function() {
    return {};
  },
  reset: function(constrainPosition) {
    delete constrainPosition.id;
  }
};
