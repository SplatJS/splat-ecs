module.exports = {
  factory: function() {
    return {
      entities: [],
      last: []
    };
  },
  reset: function(boxCollider) {
    boxCollider.entities.length = 0;
    boxCollider.last.length = 0;
    delete boxCollider.group;
    delete boxCollider.script;
    delete boxCollider.onEnter;
    delete boxCollider.onExit;
  }
};
