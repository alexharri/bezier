import { runListeners } from "../listeners/listeners";

const resolveObjectAtPosition = require("./resolveObjectAtPosition");

module.exports = function resolveMouseMove(position) {
  const obj = resolveObjectAtPosition(position);
  if (obj) {

  }

  runListeners("mousemove", position);
}
