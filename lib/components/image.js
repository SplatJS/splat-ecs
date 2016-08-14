module.exports = {
  factory: function() {
    return {};
  },
  reset: function(image) {
    delete image.name;
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
