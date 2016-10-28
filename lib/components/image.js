module.exports = {
  factory: function() {
    return {
      alpha: 1,
      sourceX: 0,
      sourceY: 0,
      destinationX: 0,
      destinationY: 0
    };
  },
  reset: function(image) {
    delete image.name;
    image.alpha = 0;
    image.sourceX = 0;
    image.sourceY = 0;
    delete image.sourceWidth;
    delete image.sourceHeight;
    image.destinationX = 0;
    image.destinationY = 0;
    delete image.destinationWidth;
    delete image.destinationHeight;
  }
};
