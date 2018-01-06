const { onToolMouseDown } = require("./src/tools/tools");
const toPosition = require("./utils/toPosition");
const resolveMouseDown = require("./src/resolve/resolveMouseDown");
const resolveMouseMove = require("./src/resolve/resolveMouseMove");
const resolveMouseUp = require("./src/resolve/resolveMouseUp");
const render = require("./src/render/render");
const { onKeyDown, onKeyUp } = require("./utils/keyboard");

window.onkeydown  = onKeyDown;
window.onkeyup    = onKeyUp;

window.onmousedown  = onToolMouseDown;
window.onmousemove  = resolveMouseMove;
window.onmouseup    = resolveMouseUp;

render(null, { noPosition: true }); // Initial render
