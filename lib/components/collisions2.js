module.exports = {
  factory: function() {
    return {
      entities: [],
      last: []
    };
  },
  reset: function(collisions) {
    collisions.entities.length = 0;
    collisions.last.length = 0;
    delete collisions.group;
    delete collisions.script;
    delete collisions.onEnter;
    delete collisions.onExit;
  }
};
