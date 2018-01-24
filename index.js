const { onToolMouseDown, onToolMouseMove, onToolMouseUp } = require("./src/tools/tools");
const toPosition = require("./src/utils/toPosition");
const render = require("./src/render/render");
const { onKeyDown, onKeyUp } = require("./src/utils/keyboard");
const createToolBar = require("./src/tools/toolbar");

const canvs = document.getElementById("canvas");

window.onkeydown  = onKeyDown;
window.onkeyup    = onKeyUp;

canvas.onmousedown  = onToolMouseDown;
canvas.onmousemove  = onToolMouseMove;
canvas.onmouseup    = onToolMouseUp;

createToolBar();

render(null, { noPosition: true }); // Initial render
