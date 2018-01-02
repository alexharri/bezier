const shortid = require("shortid");

const _listeners = {};

function removeListener(type, id) {
  if (!type || typeof type !== "string") {
    throw new Error(`Invalid type. Expected string but got '${type}'.`);
  }

  if (!id || typeof id !== "string") {
    throw new Error(`Invalid id. Expected string but got '${id}'.`);
  }

  if (
    _listeners[type] &&
    _listeners[type][id]
  ) {
    delete _listeners[type][id];
    return true;
  }

  return false;
}
exports.removeListener = removeListener;

exports.addListener = function addListener(type, func, shouldRemoveSelf) {
  if (!type || typeof type !== "string") {
    throw new Error(`Invalid type. Expected string but got '${type}'.`);
  }

  if (typeof func !== "function") {
    throw new Error(`Expected the 2nd argument to be a function. Got '${func}'`);
  }

  if (!_listeners[type]) {
    _listeners[type] = {};
  }

  const id = shortid();

  if (shouldRemoveSelf) {
    _listeners[type][id] = () => {
      func(...arguments);
      removeListener(type, id);
    };
  } else {
    _listeners[type][id] = func;
  }

  return id;
}

exports.runListeners = function runListeners(type, ...args) {
  if (!type || typeof type !== "string") {
    throw new Error(`Invalid type. Expected string but got '${type}'.`);
  }

  if (!_listeners[type] || typeof _listeners[type] !== "object") {
    return;
  }

  const keys = Object.keys(_listeners[type]);

  for (let i = 0; i < keys.length; i += 1) {
    _listeners[type][keys[i]](...args);
  }
}
