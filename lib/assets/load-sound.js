var loadAsset = require("./load-asset");

module.exports = function(audioContext, url, callback) {
  return loadAsset(url, "arraybuffer", function(err, asset) {
    if (err) {
      callback(err);
      return;
    }

    // FIXME: this is a hack, we shouldn't be rewriting asset.data in place like this
    var data = asset.data;
    asset.data = undefined;

    // FIXME: this may not work with a Blob(), might have to convert to array buffer http://stackoverflow.com/a/15981017
    audioContext.decodeAudioData(data, function(buffer) {
      asset.data = buffer;
      callback(undefined, asset);
    }, callback);
  });
};
