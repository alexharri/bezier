const quadraticToCubicBezier = require("../../bezier/quadraticToCubicBezier");
const { getPointById } = require("../../points/getPoints");
const { getHandleById } = require("../../handles/getHandles");
const { addToSelection, clearSelection, isSelected } = require("../../selection");
const addActionToHistory = require("../../actions/history/addActionToHistory");
const { types } = require("../../constants");

// This function is fired on mouseup
module.exports = function onCompleteConnection({ id, points, handles }, position, secondHandle) {
  let newPoints;

  if (secondHandle) {

  } else {
    newPoints = quadraticToCubicBezier(
      getPointById(strayConnection.points[0]),
      getHandleById(strayConnection.handles[0]),
      null,
      initialPosition);
  }

  const pointIds = newPoints.map(() => shortid());
  
  clearSelection();
  addToSelection(types.POINT, pointIds[3]); // The new point
  addActionToHistory({
    type: "COMPLETE_STRAY_CONNECTION",
    data: {
      connection: strayConnection,
      handleId: strayConnection.handles[0],
      newPoints,
      pointIds,
    },
  }, true);
}