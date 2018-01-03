const activeKeys = {};

exports.onKeyUp = function onKeyUp({ key }) {
  if (typeof key !== "string") {
    throw new Error(`Invalid key. Expected string but got '${key}'.`);
  }

  activeKeys[key] = false;
}

exports.onKeyDown = function onKeyDown({ key, repeat }) {
  if (repeat) { return; }

  if (typeof key !== "string") {
    throw new Error(`Invalid key. Expected string but got '${key}'.`);
  }

  activeKeys[key] = true;
}

exports.isKeyDown = function isKeyDown(key) {
  if (typeof key !== "string") {
    throw new Error(`Invalid key. Expected string but got '${key}'.`);
  }

  return activeKeys[key] || false;
}
