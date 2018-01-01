const toPosition = require("./utils/toPosition");
const resolveMouseDown = require("./src/resolve/resolveMouseDown");
const resolveMouseMove = require("./src/resolve/resolveMouseMove");
const render = require("./src/render/render");

canvas.onmousedown = resolveMouseDown;
canvas.onmousemove = (e) => {
  resolveMouseMove(toPosition(e)); // State changes
  render(toPosition(e)); // Draws said changes
}

render(); // Initial render
