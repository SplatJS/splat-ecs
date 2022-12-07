var loadAsset = require("./load-asset");

function blobToImage(blob) {
  var image = new Image();
  image.src = window.URL.createObjectURL(blob);
  return image;
}

module.exports = function(url, callback) {
  return loadAsset(url, "blob", function(err, asset) {
    if (err) {
      callback(err);
      return;
    }
    asset.data = blobToImage(asset.data);
    callback(undefined, asset);
  });
};
