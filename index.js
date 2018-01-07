const { onToolMouseDown, onToolMouseMove, onToolMouseUp } = require("./src/tools/tools");
const toPosition = require("./utils/toPosition");
const render = require("./src/render/render");
const { onKeyDown, onKeyUp } = require("./utils/keyboard");

window.onkeydown  = onKeyDown;
window.onkeyup    = onKeyUp;

window.onmousedown  = onToolMouseDown;
window.onmousemove  = onToolMouseMove;
window.onmouseup    = onToolMouseUp;

render(null, { noPosition: true }); // Initial render
