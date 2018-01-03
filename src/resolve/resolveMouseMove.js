const { runListeners } = require("../listeners/listeners");
const toPosition = require("../../utils/toPosition");
const resolveObjectAtPosition = require("./resolveObjectAtPosition");
const render = require("../render/render");
const setCursor = require("../../utils/setCursor");

const __CONNECTION  = require("../listeners/connections/onConnectionMouseMove");

const listeners = {
  __CONNECTION,
};

/**
 * MouseMove itself should not perform any state mutations or
 * set listeners that mutate state (except cursor icon).
 *
 * MouseMove can indirectly mutate state through listeners set
 * for "mousemove" by other user actions (such as "mousedown").
 */
module.exports = function resolveMouseMove(e) {
  const position = toPosition(e);
  runListeners("mousemove", position);

  const obj = resolveObjectAtPosition(position);
  if (!obj) {
    // Change mouse icon to default
    setCursor("DEFAULT");
    render();
    return;
  }

  const { value, type } = obj;

  /**
   * These listeners may not set new listeners that mutate state in
   * any way.
   */
  if (listeners[type]) {
    listeners[type](value);
  } else {
    setCursor("DEFAULT");
  }

  render();
}
