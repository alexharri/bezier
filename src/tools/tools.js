const { tools, defaultToolCursors } = require("../constants");
const toPosition = require("../utils/toPosition");
const { runListeners } = require("../listeners/listeners");
const resolveObjectAtPosition = require("../resolve/resolveObjectAtPosition");
const { setCursor } = require("../utils/cursor");
const render = require("../render/render");

// mousedown
const onMoveMouseDown = require("./move/onMoveMouseDown");
const onPenMouseDown = require("./pen/onPenMouseDown");

// mousemove
const onPenMouseMove = require("./pen/onPenMouseMove");

const { PEN, MOVE } = tools;

const mouseDownListeners = {
  MOVE: onMoveMouseDown,
  PEN:  onPenMouseDown,
};

const mouseMoveListeners = {
  MOVE: undefined,
  PEN:  onPenMouseMove,
};

const mouseUpListeners = {};

let currentTool = MOVE;

exports.setTool = function setTool(key) {
  if (tools[key] && tools[key] !== currentTool) {
    currentTool = tools[key];
    setCursor(currentTool);
    render(null, { useLastPosition: true });
  }
}

exports.onToolMouseDown = function onToolMouseDown(e) {
  const position = toPosition(e);

  const obj = resolveObjectAtPosition(position);
  if (!obj) {
    setCursor(defaultToolCursors[currentTool]);
  }

  if (mouseDownListeners[currentTool]) {
    mouseDownListeners[currentTool](position, obj);
  }

  render(position);
}

exports.onToolMouseMove = function onToolMouseMove(e) {
  const position = toPosition(e);
  runListeners("mousemove", position);
  
  const obj = resolveObjectAtPosition(position);
  if (!obj) {
    setCursor(defaultToolCursors[currentTool]);
  }

  if (mouseMoveListeners[currentTool]) {
    mouseMoveListeners[currentTool](position, obj);
  }

  render(position);
}

exports.onToolMouseUp = function onToolMouseUp(e) {
  const position = toPosition(e);
  runListeners("mouseup", position);
  
  const obj = resolveObjectAtPosition(position);
  if (!obj) {
    setCursor(defaultToolCursors[currentTool]);
  }

  if (mouseUpListeners[currentTool]) {
    mouseUpListeners[currentTool](position, obj);
  }

  render(position);
}
