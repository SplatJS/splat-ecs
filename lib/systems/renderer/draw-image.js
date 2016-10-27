var defaultSize = { "width": 0, "height": 0 };
var rbush = require("rbush");

// function drawEntity(game, entity, context) {
//   var imageComponent = game.entities.getComponent(entity, "image");

//   var image = imageComponent.buffer;
//   if (!image) {
//     image = game.images.get(imageComponent.name);
//   }
//   if (!image) {
//     console.error("No such image", imageComponent.name, "for entity", entity, game.entities.getComponent(entity, "name"));
//     return;
//   }

//   // FIXME: disable these checks/warnings in production version

//   var sx = imageComponent.sourceX || 0;
//   var sy = imageComponent.sourceY || 0;

//   var dx = imageComponent.destinationX || 0;
//   var dy = imageComponent.destinationY || 0;

//   var size = game.entities.getComponent(entity, "size") || defaultSize;

//   var sw = imageComponent.sourceWidth || image.width;
//   if (sw === 0) {
//     console.warn("sourceWidth is 0, image would be invisible for entity", entity, game.entities.getComponent(entity, "name"));
//   }
//   var sh = imageComponent.sourceHeight || image.height;
//   if (sh === 0) {
//     console.warn("sourceHeight is 0, image would be invisible for entity", entity, game.entities.getComponent(entity, "name"));
//   }

//   var dw = imageComponent.destinationWidth || size.width || image.width;
//   var dh = imageComponent.destinationHeight || size.height || image.height;

//   var position = game.entities.getComponent(entity, "position");

//   var dx2 = dx + position.x;
//   var dy2 = dy + position.y;

//   var rotation = game.entities.getComponent(entity, "rotation");
//   if (rotation !== undefined) {
//     context.save();
//     var rx = rotation.x || size.width / 2 || 0;
//     var ry = rotation.y || size.height / 2 || 0;
//     var x = position.x + rx;
//     var y = position.y + ry;
//     context.translate(x, y);
//     context.rotate(rotation.angle);

//     dx2 = dx - rx;
//     dy2 = dy - ry;
//   }

//   var alpha = 1;
//   if (imageComponent.alpha !== undefined) {
//     alpha = imageComponent.alpha;
//   }
//   context.globalAlpha = alpha;
//   context.drawImage(image, sx, sy, sw, sh, dx2, dy2, dw, dh);

//   if (rotation !== undefined) {
//     context.restore();
//   }
// }

var defaultCameraPosition = { x: 0, y: 0 };
var defaultCameraSize = { width: 0, height: 0 };

module.exports = function(ecs, game) {

  // var toDraw = [];

  function comparePositions(a, b) {
    return a.minZ - b.minZ || a.minY - b.minY || a.id - b.id;
  }

  console.log("new system");
  var tree = rbush();
  var isNew = true;
  var itemCache = {};

  // game.entities.onRemoveComponent("image", deleteFromCache);
  // game.entities.onRemoveComponent("size", deleteFromCache);
  // game.entities.onRemoveComponent("position", deleteFromCache);
  // function deleteFromCache(entity) {
  //   if (itemCache[entity]) {
  //     console.log("remove", entity);
  //     tree.remove(itemCache[entity]);
  //     delete itemCache[entity];
  //   }
  // }

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

    var ids = entities.find("drawImage");
    var items = [];
    for (var i = 0; i < ids.length; i++) {
      var entity = ids[i];
      var image = game.entities.getComponent(entity, "image");
      var position = game.entities.getComponent(entity, "position");
      var size = game.entities.getComponent(entity, "size") || defaultSize;

      var sx = image.sourceX || 0;
      var sy = image.sourceY || 0;

      var img = game.images.get(image.name);
      var sw = image.sourceWidth || img.width;
      var sh = image.sourceHeight || img.height;

      var dx = image.destinationX || 0;
      var dy = image.destinationY || 0;
      dx += position.x;
      dy += position.y;

      var dw = image.destinationWidth || size.width || img.width;
      var dh = image.destinationHeight || size.height || img.height;

      var cached = itemCache[entity];
      if (cached) {
        if (
          cached.minX !== dx ||
          cached.minY !== dy ||
          cached.maxX !== dx + dw ||
          cached.maxY !== dy + dh ||
          cached.sx !== sx ||
          cached.sy !== sy ||
          cached.sw !== sw ||
          cached.sh !== sh ||
          cached.image !== image.name) {

          tree.remove(cached);

          cached.id = entity;
          cached.image = image.name;
          cached.minX = dx;
          cached.minY = dy;
          cached.maxX = dx + dw;
          cached.maxY = dy + dh;
          cached.minZ = position.z || 0;
          cached.sx = sx;
          cached.sy = sy;
          cached.sw = sw;
          cached.sh = sh;

          tree.insert(cached);
        }
      } else {
        var item = {
          id: entity,
          image: image.name,
          minX: dx,
          minY: dy,
          minZ: position.z || 0,
          maxX: dx + dw,
          maxY: dy + dh,
          sx: sx,
          sy: sy,
          sw: sw,
          sh: sh
        };
        itemCache[entity] = item;
        if (isNew) {
          items.push(item);
        } else {
          tree.insert(item);
        }
      }
    }
    isNew = false;
    if (items.length > 0) {
      console.log("bulk insert", items.length);
      tree.load(items);
    }

    var visible = tree.search({
      minX: cameraPosition.x,
      minY: cameraPosition.y,
      maxX: cameraPosition.x + cameraSize.width,
      maxY: cameraPosition.y + cameraSize.height
    });
    visible.sort(comparePositions);
    for (i = 0; i < visible.length; i++) {
      item = visible[i];
      image = game.images.get(item.image);
      game.context.drawImage(image, item.sx, item.sy, item.sw, item.sh, item.minX, item.minY, item.maxX - item.minX, item.maxY - item.minY);
    }
  });
};
