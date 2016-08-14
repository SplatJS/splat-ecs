"use strict";

module.exports = {
  factory: function() {
    return {
      up: false,
      down: false,
      left: false,
      right: false,
      upAccel: -0.1,
      downAccel: 0.1,
      leftAccel: -0.1,
      rightAccel: 0.1,
      upMax: -1.0,
      downMax: 1.0,
      leftMax: -1.0,
      rightMax: 1.0
    };
  },
  reset: function(movement2d) {
    movement2d.up = false;
    movement2d.down = false;
    movement2d.left = false;
    movement2d.right = false;
    movement2d.upAccel = -0.1;
    movement2d.downAccel = 0.1;
    movement2d.leftAccel = -0.1;
    movement2d.rightAccel = 0.1;
    movement2d.upMax = -1.0;
    movement2d.downMax = 1.0;
    movement2d.leftMax = -1.0;
    movement2d.rightMax = 1.0;
  }
};
