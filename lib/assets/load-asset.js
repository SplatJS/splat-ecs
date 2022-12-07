var once = require("../once");

module.exports = function(url, responseType, callback) {
  callback = once(callback);
  var asset = {
    loaded: 0,
    total: 1,
    data: undefined
  };

  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = responseType;
  request.addEventListener("progress", function(e) {
    if (e.lengthComputable) {
      asset.loaded = e.loaded;
      asset.total = e.total;
    }
  });
  request.addEventListener("load", function() {
    asset.data = request.response;
    asset.loaded = asset.total;
    callback(undefined, asset);
  });
  request.addEventListener("abort", function(e) {
    asset.error = e;
    callback(e);
  });
  request.addEventListener("error", function(e) {
    asset.error = e;
    callback(e);
  });
  try {
    request.send();
  } catch (e) {
    callback(e);
  }
  return asset;
};
