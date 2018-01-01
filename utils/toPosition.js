const { getLeftOffset, getTopOffset } = require("../src/canvas/getCanvasOffset");

const toPosition = e => ({
  x: e.clientX - getLeftOffset(),
  y: e.clientY - getTopOffset(),
});

module.exports = toPosition;
