module.exports = function setOrAddComponent(entities, entity, component, value) {
  if (typeof value !== "object") {
    entities.setComponent(entity, component, value);
  } else {
    var data = entities.addComponent(entity, component);
    Object.keys(value).forEach(function(valKey) {
      data[valKey] = value[valKey];
    });
  }
};
