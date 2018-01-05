const { keys } = require("../src/constants");
const undo = require("../src/actions/history/undo");
const redo = require("../src/actions/history/redo");

const activeKeys = {};

function isKeyDown(key) {
  if (typeof key !== "string") {
    throw new Error(`Invalid key. Expected string but got '${key}'.`);
  }

  return activeKeys[key] || false;
}

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

  if (key === "Z" && isKeyDown(keys.CONTROL) && isKeyDown(keys.SHIFT)) {
    redo();
    return;
  }

  if (key === "z" && isKeyDown(keys.CONTROL)) {
    undo();
    return;
  }

  activeKeys[key] = true;
}

exports.isKeyDown = isKeyDown;
