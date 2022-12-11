export default function registerAll(entities, componentSpecs) {
  var names = Object.keys(componentSpecs);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    var componentSpec = componentSpecs[name];
    entities.registerComponent(
      name,
      componentSpec.factory,
      componentSpec.reset,
      componentSpec.poolSize
    );
  }
}
