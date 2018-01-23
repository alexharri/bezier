// Common actions
const move = require("./common/move");

// Point actions
const addPoint = require("./point/addPoint");
const addPenPoint = require("./point/addPenPoint");

// Connection actions
const addConnection = require("./connection/addConnection");
const splitConnection = require("./connection/splitConnection");
const splitLineConnection = require("./connection/splitLineConnection");
const addStrayConnection = require("./connection/addStrayConnection");
const completeStrayConnection = require("./connection/completeStrayConnection");
const replaceConnectionPointIds = require("./connection/replaceConnectionPointIds");

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
  ADD_PEN_POINT: addPenPoint,

  // Connection actions
  ADD_CONNECTION: addConnection,
  DELETE_CONNECTION: reverse(addConnection),
  SPLIT_CONNECTION: splitConnection,
  SPLIT_LINE_CONNECTION: splitLineConnection,
  ADD_STRAY_CONNECTION: addStrayConnection,
  COMPLETE_STRAY_CONNECTION: completeStrayConnection,
  REPLACE_CONNECTION_POINT_IDS: replaceConnectionPointIds,

  // Handle actions
  ADD_HANDLES: addHandles,
  DELETE_HANDLES: reverse(addHandles),
});
