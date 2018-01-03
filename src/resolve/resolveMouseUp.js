const { runListeners } = require("../listeners/listeners");
const toPosition = require("../../utils/toPosition");
const resolveObjectAtPosition = require("./resolveObjectAtPosition");
const render = require("../render/render");

const listeners = {};

module.exports = function resolveMouseUp(e) {
  const position = toPosition(e);
  runListeners("mouseup");

  const obj = resolveObjectAtPosition(position);
  if (!obj) {
    return;
  }

  const { value, type } = obj;
  if (listeners[type]) {
    listeners[type](value);
  }
  render(position);
}