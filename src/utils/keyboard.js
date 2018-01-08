const tools = require("../tools/tools");
const { keys } = require("../constants");
const undo = require("../actions/history/undo");
const redo = require("../actions/history/redo");

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

  // Windows
  if (key.toLowerCase() === "z" && isKeyDown(keys.CONTROL) && isKeyDown(keys.SHIFT)) {
    redo();
    return;
  }
  if (key === "z" && isKeyDown(keys.CONTROL)) {
    undo();
    return;
  }

  // MacOS - Meta is Command
  if (key.toLowerCase() === "z" && isKeyDown("Meta") && isKeyDown(keys.SHIFT)) {
    redo();
    return;
  }
  if (key === "z" && isKeyDown("Meta")) {
    undo();
    return;
  }

  tools.setTool(key); // Only changes to tool if key is a valid tool.

  activeKeys[key] = true;
}

exports.isKeyDown = isKeyDown;
