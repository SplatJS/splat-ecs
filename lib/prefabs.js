import clone from "./clone";
import setOrAddComponent from "./set-or-add-component";

function Prefabs(prefabs) {
  this.prefabs = prefabs;
}
Prefabs.prototype.instantiate = function (entities, name) {
  var id = entities.create();
  var prefab = this.prefabs[name];
  Object.keys(prefab).forEach(function (key) {
    if (key === "id") {
      return;
    }
    setOrAddComponent(entities, id, key, clone(prefab[key]));
  });
  return id;
};
Prefabs.prototype.register = function (name, components) {
  this.prefabs[name] = components;
};
Prefabs.prototype.registerMultiple = function (prefabs) {
  Object.keys(prefabs).forEach(
    function (key) {
      this.registerPrefab(key, prefabs[key]);
    }.bind(this)
  );
};

export default Prefabs;
