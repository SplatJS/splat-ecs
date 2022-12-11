export default {
  factory: function () {
    return {
      up: "up",
      down: "down",
      left: "left",
      right: "right",
    };
  },
  reset: function (playerController2d) {
    playerController2d.up = "up";
    playerController2d.down = "down";
    playerController2d.left = "left";
    playerController2d.right = "right";
  },
};
