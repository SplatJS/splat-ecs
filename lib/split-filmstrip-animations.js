import clone from "./clone";

export default function splitFilmStripAnimations(animations) {
  Object.keys(animations).forEach(function (key) {
    var firstFrame = animations[key][0];
    if (firstFrame.filmstripFrames) {
      splitFilmStripAnimation(animations, key);
    }
  });
}

function splitFilmStripAnimation(animations, key) {
  var firstFrame = animations[key][0];
  if (
    firstFrame.properties.image.sourceWidth % firstFrame.filmstripFrames !=
    0
  ) {
    console.warn(
      'The "' +
        key +
        '" animation is ' +
        firstFrame.properties.image.sourceWidth +
        " pixels wide and that is is not evenly divisible by " +
        firstFrame.filmstripFrames +
        " frames."
    );
  }
  for (var i = 0; i < firstFrame.filmstripFrames; i++) {
    var frameWidth =
      firstFrame.properties.image.sourceWidth / firstFrame.filmstripFrames;
    var newFrame = clone(firstFrame);
    newFrame.properties.image.sourceX = frameWidth * i;
    newFrame.properties.image.sourceWidth = frameWidth;
    animations[key].push(newFrame);
  }
  animations[key].splice(0, 1);
}
