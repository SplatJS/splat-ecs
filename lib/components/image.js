module.exports = {
  factory: function() {
    return {
      name: undefined
    };
  },
  reset: function(image) {
    image.name = "undefined";
    delete image.alpha;
    delete image.sourceX;
    delete image.sourceY;
    delete image.sourceWidth;
    delete image.sourceHeight;
    delete image.destinationX;
    delete image.destinationY;
    delete image.destinationWidth;
    delete image.destinationHeight;
  }
};
