const toPosition = require("./utils/toPosition");
const resolveMouseDown = require("./src/resolve/resolveMouseDown");
const resolveMouseMove = require("./src/resolve/resolveMouseMove");
const resolveMouseUp = require("./src/resolve/resolveMouseUp");
const render = require("./src/render/render");

canvas.onmousedown = resolveMouseDown;
canvas.onmouseup = resolveMouseUp;
canvas.onmousemove = (e) => {
  resolveMouseMove(toPosition(e)); // State changes
  render(toPosition(e)); // Draws said changes
}

render(); // Initial render
