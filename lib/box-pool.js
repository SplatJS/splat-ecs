var boxIntersect = require("box-intersect");
var ObjectPool = require("entity-component-system/lib/object-pool");

function boxFactory() {
  return [0, 0, 0, 0];
}

var boxPool = new ObjectPool(boxFactory, 64);

function BoxPool() {
  this.ids = [];
  this.boxes = [];
  this.length = 0;
  this.handleCollisionSelf = this.handleCollisionSelf.bind(this);
}
BoxPool.prototype.add = function(id, position, size) {
  this.ids.push(id);

  var box = boxPool.alloc();
  box[0] = position.x;
  box[1] = position.y;
  box[2] = position.x + size.width;
  box[3] = position.y + size.height;
  this.boxes.push(box);
};
BoxPool.prototype.reset = function() {
  this.ids.length = 0;
  for (var i = 0; i < this.boxes.length; i++) {
    boxPool.free(this.boxes[i]);
  }
  this.boxes.length = 0;
};
BoxPool.prototype.collideSelf = function(handler) {
  this.handler = handler;
  boxIntersect(this.boxes, this.handleCollisionSelf);
};
BoxPool.prototype.handleCollisionSelf = function(a, b) {
  var idA = this.ids[a];
  var idB = this.ids[b];
  this.handler(idA, idB);
};

module.exports = BoxPool;
