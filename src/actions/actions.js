// Point actions
const addPoint = require("./point/addPoint");
const setPointPosition = require("./point/setPointPosition");
const movePointAndHandles = require("./point/movePointAndHandles");

// Connection actions
const addConnection = require("./connection/addConnection");
const splitConnection = require("./connection/splitConnection");

// Handle actions
const setHandlePosition = require("./connection/setHandlePosition");
const addHandles = require("./handle/addHandles");

const reverse = ({ undo, redo }) => ({
  redo: undo,
  undo: redo,
});

module.exports = Object.freeze({
  // Point actions
  ADD_POINT: addPoint,
  DELETE_POINT: reverse(addPoint),
  SET_POINT_POSITION: setPointPosition,
  MOVE_POINT_AND_HANDLES: movePointAndHandles,

  // Connection actions
  ADD_CONNECTION: addConnection,
  DELETE_CONNECTION: reverse(addConnection),
  SPLIT_CONNECTION: splitConnection,

  // Handle actions
  SET_HANDLE_POSITION: setHandlePosition,
  ADD_HANDLES: addHandles,
  DELETE_HANDLES: reverse(addHandles),
});
