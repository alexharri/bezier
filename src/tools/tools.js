const { tools } = require("../constants");
const onMoveMouseDown = require("./move/onMoveMouseDown");
const onPenMouseDown = require("./pen/onPenMouseDown");

const { PEN, MOVE } = tools;

const mouseDownListeners = {
  MOVE: onMoveMouseDown,
  PEN:  onPenMouseDown,
};

const mouseMoveListeners = {
  MOVE: undefined,
  PEN:  undefined,
};

let currentTool = tools.MOVE;

exports.setTool = function setTool(key) {
  if (tools[key]) {
    currentTool = tools[key];
  }
}

exports.onToolMouseDown = function onToolMouseDown(e) {
  if (mouseDownListeners[currentTool]) {
    mouseDownListeners[currentTool](e);
  }
}