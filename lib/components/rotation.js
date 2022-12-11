export default {
  factory: function () {
    return {
      angle: 0,
    };
  },
  reset: function (rotation) {
    rotation.angle = 0;
    delete rotation.x;
    delete rotation.y;
  },
};
