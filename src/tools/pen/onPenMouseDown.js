const shortid = require("shortid");

const { addListener, removeListener } = require("../../listeners/listeners");
const { isKeyDown } = require("../../utils/keyboard");
const getStrayConnection = require("../../connections/getStrayConnection");
const { getSelectedOfType } = require("../../selection");
const { setCursor, releaseOverride } = require("../../utils/cursor");
const splitCubicBezier = require("../../bezier/splitCubicBezier");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const addActionToHistory = require("../../actions/history/addActionToHistory");
const onMoveMouseDown = require("../move/onMoveMouseDown");
const { types, cursors, keys } = require("../../constants");
const store = require("../../store");
const quadraticToCubicBezier = require("../../bezier/quadraticToCubicBezier");
const { getPointById } = require("../../points/getPoints");
const { getHandleById } = require("../../handles/getHandles");
const getPosDifference = require("../../utils/getPosDifference");
const { addToSelection, clearSelection, isSelected } = require("../../selection");

const onPenAddPoint = require("./onPenAddPoint");

module.exports = function onPenMouseDown(initialPosition, obj) {
  if (!obj) {
    /**
     * Nothing was clicked on, let's see if there are some selected
     * points.
     */
    const selectedPoints = getSelectedOfType(types.POINT);

    if (selectedPoints.length === 1) {
      /**
       * A single selected point means we are going to be creating a
       * path between that point and where we clicked.
       *
       * If there's a stray connection, we use it.
       */
      const strayConnection = getStrayConnection(selectedPoints[0]);
      if (strayConnection) {
        onPenAddPoint(initialPosition, {
          strayConnection,
        });
      } else {
        onPenAddPoint(initialPosition, {
          selectedPoint: selectedPoints[0],
        });
      }
    } else {
      // No or multiple points selected, so we create an unconnected point
      onPenAddPoint(initialPosition);
    }
    return;
  }

  const { value, type } = obj;

  /**
   * We clicked on a connection with the pen tool, so we
   * split the connection.
   */
  if (type === types.CONN) {
    const { connection, closestPoint } = value;
    const { t } = closestPoint; // t is where we split the path

    const currentPoints = getConnectionPoints(connection);

    if (!currentPoints[1] && !currentPoints[2]) {
      /**
       * No handles, so we're splitting a straight line.
       */
      const newPointId = shortid();

      clearSelection();
      addToSelection(types.POINT, newPointId);

      addActionToHistory({
        type: "SPLIT_LINE_CONNECTION",
        data: {
          ids: [shortid(), shortid()],
          connection,
          newPoint: {
            ...closestPoint,
            id: newPointId,
          },
        },
      }, true);
    } else {
      /**
       * Splitting a cubic bezier
       */
      const newPoints = splitCubicBezier(currentPoints, t);

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
          ids: [shortid(), shortid()], 
          connection,
          newPoints
        },
      }, true);
      setCursor("DEFAULT"); // There will be a point below the mouse
    }
  }

  /**
   * If we click a handle, we simply move it.
   */
  if (type === types.HANDLE) {
    onMoveMouseDown(initialPosition, obj);
  }

  /**
   * This is where things get fun.
   */
  if (type === types.POINT) {
    // We clear the selection if shift is not being held
    if (!isKeyDown(keys.SHIFT)) {
      clearSelection();
    }
    // The point however, will always be selected
    if (!isSelected(types.POINT, value.id)) {
      addToSelection(types.POINT, value.id);
    }

    let mouseMoved = false;
    let cursorOverrideId;
    let lastPosition = initialPosition;

    const selectedPoints = getSelectedOfType(types.POINT);
    let strayConnection = selectedPoints.length === 1
      ? getStrayConnection(selectedPoints[0])
      : null;

    if (!strayConnection) {
      /**
       * If there's no stray connection we create one if the mouse is
       * moved.
       *
       * Otherwise nothing happens except that the point is selected.
       */

      let newConnectionId = shortid();
      let newHandleId = shortid();

      const listenerId = addListener("mousemove", (currentPosition) => {
        if (!mouseMoved) {
          // This creates the new stray connection and handle
          mouseMoved = true;
          cursorOverrideId = setCursor("PEN", { override: true });

          store.dispatch({
            type: "ADD_CONNECTION",
            payload: {
              id: newConnectionId,
              points: [value.id, null],
              handles: [newHandleId, null],
            }
          });
          store.dispatch({
            type: "ADD_HANDLES",
            payload: [{
              x: currentPosition.x,
              y: currentPosition.y,
              id: newHandleId,
            }],
          });
        } else {
          // Mouse was already moved, so we just update the position.
          store.dispatch({
            type: "MOVE",
            payload: {
              selection: {
                [types.HANDLE]: [newHandleId],
              },
              positionChange: getPosDifference(lastPosition, currentPosition),
            },
          });
        }
        
        lastPosition = currentPosition;
      });

      addListener("mouseup", () => {
        removeListener("mousemove", listenerId);
  
        if (typeof cursorOverrideId === "string") {
          releaseOverride(cursorOverrideId);
          setCursor("DEFAULT");
        }
  
        // Creates the action to create the new stray connection.
        if (mouseMoved && !strayConnection) {
          addActionToHistory({
            type: "ADD_STRAY_CONNECTION",
            data: {
              pointId: selectedPoints[0],
              connectionId: newConnectionId,
              handleId: newHandleId,
              handlePosition: lastPosition,
            }
          }, false);
        }
      }, true);
    }
  }
}