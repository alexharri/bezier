const { runListeners } = require("../listeners/listeners");
const toPosition = require("../../utils/toPosition");
const resolveObjectAtPosition = require("./resolveObjectAtPosition");
const render = require("../render/render");

module.exports = function resolveMouseMove(e) {
  const position = toPosition(e);
  const obj = resolveObjectAtPosition(position);
  if (obj) {

  }

  runListeners("mousemove", position);
  render(position);
}
