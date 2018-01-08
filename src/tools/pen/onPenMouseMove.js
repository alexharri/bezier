import { getHandleById } from "../../handles/getHandles";
import { getPointById } from "../../points/getPoints";

const { getPointConnections } = require("../../points/getPoints");
const { addGuide } = require("../../render/guides");
const { getSelectedOfType } = require("../../selection");
const { setCursor } = require("../../utils/cursor");
const { types } = require("../../constants");
const quadraticToCubicBezier = require("../../bezier/quadraticToCubicBezier");

function setPenCursor(type) {
  if (type === types.CONN) {
    setCursor("PEN_ADD_POINT");
  } else if (type === types.HANDLE) {
    setCursor("DEFAULT");
  } else if (type === types.POINT) {
    setCursor("PEN_SELECT_POINT");
  }
}

module.exports = function onPenMouseMove(position, obj) {
  if (!obj) {
    // Show guide for new point creation
    addGuide(types.POINT, position);

    const selectedPoints = getSelectedOfType(types.POINT);

    /**
     * If there's one point selected we want to draw a guide
     * between the selected and possible new point.
     */
    if (selectedPoints.length === 1) {
      let strayConnection = false;

      { // Checking for stray connections
        const connections = getPointConnections(selectedPoints[0]);
        for (let i = 0; i < connections.length; i += 1) {
          if (connections[i].points[1] === null) {
            strayConnection = connections[i];
            i = connections.length;
          }
        }
      }

      /**
       * A stray connection means that a handle has been dragged out
       * from the point.
       *
       * If this is the case, we need to draw a bezier guide, but we only
       * have one handle, so we need to make assumptions about the other.
       */
      if (strayConnection) {
        const newPoints = quadraticToCubicBezier(
          getPointById(selectedPoints[0]),
          getHandleById(strayConnection.handles[0]),
          null,
          position);
        addGuide(types.CONN, newPoints);
      } else {
        /**
         * There is a single connection selected with no stray connections,
         * so we should show a guide line between them.
         */
        console.log("LINE");
      }
      // Show guide curve between points
    }
    return;
  }

  const { value, type } = obj;

  setPenCursor(type);

  if (type === types.CONN) {
    const { closestPoint } = value;
    addGuide(types.POINT, value.closestPoint);
  }
}
