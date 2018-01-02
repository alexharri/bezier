import { runListeners } from "../listeners/listeners";

const toPosition = require("../../utils/toPosition");
const resolveObjectAtPosition = require("./resolveObjectAtPosition");

const __CONNECTION = require("../listeners/connections/onConnectionMouseDown");
const __POINT = require("../listeners/points/onPointMouseDown");

const listeners = {
  __HANDLE: null,
  __POINT,
  __CONNECTION,
}

module.exports = function resolveMouseDown(e) {
  const position = toPosition(e);
  runListeners("mousedown", position);

  const obj = resolveObjectAtPosition(position);
  if (!obj) {
    return;
  }

  const { value, type } = obj;
  return listeners[type] && listeners[type](value);
}