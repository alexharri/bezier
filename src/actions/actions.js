// Point actions
const addPoint = require("./point/addPoint");
const setPointPosition = require("./point/setPointPosition");

// Connection actions
const addConnection = require("./connection/addConnection");
const splitConnection = require("./connection/splitConnection");

const reverse = ({ undo, redo }) => ({
  redo: undo,
  undo: redo,
});

module.exports = Object.freeze({
  // Point actions
  ADD_POINT: addPoint,
  DELETE_POINT: reverse(addPoint),
  SET_POINT_POSITION: setPointPosition,

  // Connection actions
  ADD_CONNECTION: addConnection,
  DELETE_CONNECTION: reverse(addConnection),
  SPLIT_CONNECTION: splitConnection,
});
