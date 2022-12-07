export default {
  factory: function () {
    return {
      duration: 0,
      // magnitude: 1,
      // magnitudeX: 1,
      // magnitudeY: 1
    };
  },
  reset: function (shake) {
    shake.duration = 0;
    delete shake.magnitude;
    delete shake.magnitudeX;
    delete shake.magnitudeY;
  },
};
