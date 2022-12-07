export default {
  factory: function () {
    return {};
  },
  reset: function (easing) {
    var names = Object.keys(easing);
    for (var i = 0; i < names.length; i++) {
      delete easing[name[i]];
    }
  },
};
