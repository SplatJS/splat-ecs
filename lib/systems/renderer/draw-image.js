var defaultSize = { "width": 0, "height": 0 };

function drawEntity(game, entity, context) {
  var imageComponent = game.entities.getComponent(entity, "image");

  var image = imageComponent.buffer;
  if (!image) {
    image = game.images.get(imageComponent.name);
  }
  if (!image) {
    console.error("No such image", imageComponent.name, "for entity", entity, game.entities.getComponent(entity, "name"));
    return;
  }

  // FIXME: disable these checks/warnings in production version

  var sx = imageComponent.sourceX || 0;
  var sy = imageComponent.sourceY || 0;

  var dx = imageComponent.destinationX || 0;
  var dy = imageComponent.destinationY || 0;

  var size = game.entities.getComponent(entity, "size") || defaultSize;

  var sw = imageComponent.sourceWidth || image.width;
  if (sw === 0) {
    console.warn("sourceWidth is 0, image would be invisible for entity", entity, game.entities.getComponent(entity, "name"));
  }
  var sh = imageComponent.sourceHeight || image.height;
  if (sh === 0) {
    console.warn("sourceHeight is 0, image would be invisible for entity", entity, game.entities.getComponent(entity, "name"));
  }

  var dw = imageComponent.destinationWidth || size.width || image.width;
  var dh = imageComponent.destinationHeight || size.height || image.height;

  var position = game.entities.getComponent(entity, "position");

  var dx2 = dx + position.x;
  var dy2 = dy + position.y;

  var rotation = game.entities.getComponent(entity, "rotation");
  if (rotation !== undefined) {
    context.save();
    var rx = rotation.x || size.width / 2 || 0;
    var ry = rotation.y || size.height / 2 || 0;
    var x = position.x + rx;
    var y = position.y + ry;
    context.translate(x, y);
    context.rotate(rotation.angle);

    dx2 = dx - rx;
    dy2 = dy - ry;
  }

  var alpha = 1;
  if (imageComponent.alpha !== undefined) {
    alpha = imageComponent.alpha;
  }
  context.globalAlpha = alpha;
  context.drawImage(image, sx, sy, sw, sh, dx2, dy2, dw, dh);

  if (rotation !== undefined) {
    context.restore();
  }
}

var defaultCameraPosition = { x: 0, y: 0 };
var defaultCameraSize = { width: 0, height: 0 };

module.exports = function(ecs, game) {

  var toDraw = [];

  function comparePositions(a, b) {
    if (a === -1) {
      return 1;
    }
    if (b === -1) {
      return -1;
    }
    var pa = game.entities.getComponent(a, "position");
    var pb = game.entities.getComponent(b, "position");
    var za = pa.z || 0;
    var zb = pb.z || 0;
    var ya = pa.y || 0;
    var yb = pb.y || 0;
    return za - zb || ya - yb || a - b;
  }

  game.entities.registerSearch("drawImage", ["image", "position"]);
  ecs.add(function drawImage(entities) {
    var camera = game.entities.find("camera")[0];
    var cameraPosition;
    var cameraSize;
    if (camera) {
      cameraPosition = game.entities.getComponent(camera, "position");
      cameraSize = game.entities.getComponent(camera, "size");
    } else {
      cameraPosition = defaultCameraPosition;
      cameraSize = defaultCameraSize;
      cameraSize.width = game.canvas.width;
      cameraSize.height = game.canvas.height;
    }

    toDraw.length = 0;

    var ids = entities.find("drawImage");
    for (var i = 0; i < ids.length; i++) {
      if (isOnScreen(game, ids[i], cameraPosition, cameraSize)) {
        toDraw.push(ids[i]);
      }
    }

    toDraw.sort(comparePositions);

    for (i = 0; i < toDraw.length; i++) {
      drawEntity(game, toDraw[i], game.context);
    }
  });
};

function isOnScreen(game, entity, cameraPosition, cameraSize) {
  var imageComponent = game.entities.getComponent(entity, "image");

  var image = imageComponent.buffer;
  if (!image) {
    image = game.images.get(imageComponent.name);
  }
  if (!image) {
    console.error("No such image", imageComponent.name, "for entity", entity, game.entities.getComponent(entity, "name"));
    return false;
  }

  // FIXME: disable these checks/warnings in production version

  var dx = imageComponent.destinationX || 0;
  var dy = imageComponent.destinationY || 0;

  var size = game.entities.getComponent(entity, "size") || defaultSize;

  var dw = imageComponent.destinationWidth || size.width || image.width;
  if (dw === 0) {
    console.warn("destinationWidth is 0, image would be invisible for entity", entity, game.entities.getComponent(entity, "name"));
  }
  var dh = imageComponent.destinationHeight || size.height || image.height;
  if (dh === 0) {
    console.warn("destinationHeight is 0, image would be invisible for entity", entity, game.entities.getComponent(entity, "name"));
  }

  var position = game.entities.getComponent(entity, "position");

  var dx2 = dx + position.x;
  var dy2 = dy + position.y;

  return (dx2 + dw >= cameraPosition.x &&
    dy2 + dh >= cameraPosition.y &&
    dx2 < cameraPosition.x + cameraSize.width &&
    dy2 < cameraPosition.y + cameraSize.height
  );
}
