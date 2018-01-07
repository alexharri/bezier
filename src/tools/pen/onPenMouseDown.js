
const shortid = require("shortid");

const { addListener, removeListener } = require("../../listeners/listeners");
const { getAllConnections } = require("../../connections/getConnections");
const { isKeyDown } = require("../../utils/keyboard");
const { setCursor, releaseOverride } = require("../../utils/cursor");
const splitBezier = require("../../bezier/splitBezier");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const addActionToHistory = require("../../actions/history/addActionToHistory");
const onMoveMouseDown = require("../move/onMoveMouseDown");
const { types, cursors, keys } = require("../../constants");
const store = require("../../store");
const getPosDifference = require("../../utils/getPosDifference");
const {
  addToSelection,
  clearSelection,
  isSelected,
} = require("../../selection");

module.exports = function onPenMouseDown(initialPosition, obj) {
  if (!obj) {
    return;
  }

  const { value, type } = obj;

  if (type === types.CONN) {
    const { connection, closestPoint } = value;
    const { t } = closestPoint; // t is where we split the path
  
    const newPoints = splitBezier(getConnectionPoints(connection), t);
  
    for (let i = 0; i < newPoints.length; i += 1) {
      newPoints[i].id = shortid();
    }
  
    // p2 and p4 will be siblings
    newPoints[2].sibling = newPoints[4].id;
    newPoints[4].sibling = newPoints[2].id;

    // Selecting the new point
    clearSelection();
    addToSelection(types.POINT, newPoints[3].id);

    addActionToHistory({
      type: "SPLIT_CONNECTION",
      data: {
        connection,
        newPoints
      },
    }, true);
    setCursor("DEFAULT"); // There will be a point below the mouse
  }

  if (type === types.HANDLE) {
    onMoveMouseDown(initialPosition, obj);
  }

  if (type === types.POINT) {
    if (!isKeyDown(keys.SHIFT)) {
      clearSelection();
    }
    if (!isSelected(types.POINT, value.id)) {
      addToSelection(types.POINT, value.id);
    }

    let mouseMoved = false;
    let cursorOverrideId;
    let lastPosition = initialPosition;

    let connectionId = shortid();
    let handleId = shortid();
    let hasStrayConnection = false;

    /*
    { // Checking for stray connections
      const connections = getPointConnections(selectedPoints[0]);
      for (let i = 0; i < connections.length; i += 1) {
        if (connections[i].points[1] === null) {
          strayConnection = connections[i];
          i = connections.length;
        }
      }
    }
    */

    const listenerId = addListener("mousemove", (currentPosition) => {
      if (!mouseMoved && !hasStrayConnection) {
        mouseMoved = true;
        cursorOverrideId = setCursor("PEN", { override: true });

        store.dispatch({
          type: "ADD_CONNECTION",
          payload: {
            id: connectionId,
            points: [value.id, null],
            handles: [handleId, null],
          }
        });
        store.dispatch({
          type: "ADD_HANDLES",
          payload: [{
            x: currentPosition.x,
            y: currentPosition.y,
            id: handleId,
          }],
        });
      } else {
        store.dispatch({
          type: "MOVE",
          payload: {
            selection: {
              [types.HANDLE]: [handleId],
            },
            positionChange: getPosDifference(lastPosition, currentPosition),
          },
        });
      }

      lastPosition = currentPosition;
    });

    addListener("mouseup", (currentPosition) => {
      removeListener("mousemove", listenerId);

      if (typeof cursorOverrideId === "string") {
        releaseOverride(cursorOverrideId);
        setCursor("DEFAULT");
      }

      // Creates the move action if the mouse was moved
      if (mouseMoved) {
        addActionToHistory({
          type: "MOVE",
          data: {
            positionChange: getPosDifference(initialPosition, lastPosition),
          },
        }, false);
      }
    }, true);
  }
}