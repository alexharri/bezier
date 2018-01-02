import { runListeners } from "../listeners/listeners";

const toPosition = require("../../utils/toPosition");
const resolveObjectAtPosition = require("./resolveObjectAtPosition");

const listeners = {};

module.exports = function resolveMouseUp(e) {
  runListeners("mouseup");

  const obj = resolveObjectAtPosition(toPosition(e));
  if (!obj) {
    return;
  }

  const { value, type } = obj;
  return listeners[type] && listeners[type](value);
}