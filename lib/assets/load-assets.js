var once = require("../once");

module.exports = function(manifest, loader, callback) {
  callback = once(callback);

  var finished = 0;
  var keys = Object.keys(manifest);
  return keys.reduce(function(assets, key) {
    var url = manifest[key];
    assets[key] = loader(url, function(err) {
      if (err) {
        callback(err);
        return;
      }
      finished++;
      if (finished === keys.length) {
        callback(undefined, assets);
      }
    });
    return assets;
  }, {});
};
