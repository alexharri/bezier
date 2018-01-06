// Common actions
const move = require("./common/move");

// Point actions
const addPoint = require("./point/addPoint");

// Connection actions
const addConnection = require("./connection/addConnection");
const splitConnection = require("./connection/splitConnection");

// Handle actions
const addHandles = require("./handle/addHandles");

const reverse = ({ undo, redo }) => ({
  redo: undo,
  undo: redo,
});

module.exports = Object.freeze({
  // Common
  MOVE: move,

  // Point actions
  ADD_POINT: addPoint,
  DELETE_POINT: reverse(addPoint),

  // Connection actions
  ADD_CONNECTION: addConnection,
  DELETE_CONNECTION: reverse(addConnection),
  SPLIT_CONNECTION: splitConnection,

  // Handle actions
  ADD_HANDLES: addHandles,
  DELETE_HANDLES: reverse(addHandles),
});
