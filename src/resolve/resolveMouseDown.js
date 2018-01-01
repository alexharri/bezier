const toPosition = require("../../utils/toPosition");
const resolveObjectAtPosition = require("./resolveObjectAtPosition");

const __CONNECTION = require("../listeners/connections/onConnectionMouseDown");

const listeners = {
  __HANDLE: null,
  __POINT: null,
  __CONNECTION,
}

module.exports = function resolveMouseDown(e) {
  const position = toPosition(e)

  /**
   * See if the user is close enough to something that
   * he can interact with.
   */
  const obj = resolveObjectAtPosition(position);
  if (!obj) {
    return;
  }

  
  const { value, type } = obj;
  return listeners[type] && listeners[type](value);
}