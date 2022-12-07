var buffer = require("./buffer");

/**
 * @namespace Splat
 */
module.exports = {
  makeBuffer: buffer.makeBuffer,
  flipBufferHorizontally: buffer.flipBufferHorizontally,
  flipBufferVertically: buffer.flipBufferVertically,

  ads: require("./ads"),
  AStar: require("./astar"),
  BinaryHeap: require("./binary-heap"),
  Game: require("./game"),
  iap: require("./iap"),
  Input: require("./input"),
  leaderboards: require("./leaderboards"),
  math: require("./math"),
  openUrl: require("./openUrl"),
  NinePatch: require("./ninepatch"),
  Particles: require("./particles"),
  saveData: require("./save-data"),
  Scene: require("./scene")
};
