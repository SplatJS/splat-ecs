import platform from "./platform";

let openUrl;
/**
 * Open a url in a new window.
 * @alias Splat.openUrl
 * @param {string} url The url to open in a new window.
 */
openUrl = function (url) {
  window.open(url);
};

if (platform.isEjecta()) {
  openUrl = function (url) {
    window.ejecta.openURL(url);
  };
}

export default openUrl;
