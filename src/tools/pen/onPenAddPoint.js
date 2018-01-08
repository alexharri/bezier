import { getHandleById } from "../../handles/getHandles";

const shortid = require("shortid");

const { addListener, removeListener } = require("../../listeners/listeners");
const isValidPosition = require("../../utils/isValidPosition");
const { addToSelection, clearSelection, isSelected } = require("../../selection");
const addActionToHistory = require("../../actions/history/addActionToHistory");
const { setCursor, releaseOverride } = require("../../utils/cursor");
const getPosDifference = require("../../utils/getPosDifference");
const store = require("../../store");
const mirrorPosition = require("../../utils/mirrorPosition");
const { types } = require("../../constants");

const defaultOpts = {
  handleMirrorId: "",
  strayConnection: null,
}

module.exports = function onPenAddPoint(position, opts = defaultOpts) {
  if (!isValidPosition(position)) {
    throw new Error("Invalid position.");
  }

  const data = {};

  const pointId = shortid();

  const point = {
    id: pointId,
    x: position.x,
    y: position.y,
  };

  store.dispatch({ type: "ADD_POINT", payload: point });
  data.point = point;

  clearSelection();
  addToSelection(types.POINT, pointId);

  let mouseMoved = false;
  let cursorOverrideId;
  let lastPosition = position;

  const handleId = shortid();
  const connectionId = shortid();


  let originalMovedHandle;
  let strayConnectionPoints;
  let newCompletedConnectionHandle;

  /**
   * We complete the stray connection by connecting the
   * new point to it.
   */
  if (opts.strayConnection) {
    const { strayConnection } = opts;

    const newPoints = quadraticToCubicBezier(
      getPointById(strayConnection.points[0]),
      getHandleById(strayConnection.handles[0]),
      null,
      initialPosition);

    strayConnectionPoints = newPoints;

    /**
     * The handle of the new point for the completed connection.
     *
     * If the mouse is not moved, p2 of the new points will be used
     * for the position of the handle.
     *
     * If the mouse is moved, the mirror of the mouseup position will
     * be the handle position.
     */
    data.newCompletedConnectionHandle = {
      id: shortid(),
      x: newPoints[2].x,
      y: newPoints[2].y,
    };

    data.completedConnection = {
      id: strayConnection.id,
      points:   [strayConnection.points[0],   point.id],
      handles:  [strayConnection.handles[0],  data.newCompletedConnectionHandle.id],
    };

    store.dispatch({ type: "ADD_HANDLES", payload: [data.newCompletedConnectionHandle] });
    store.dispatch({ type: "REPLACE_CONNECTION_POINT_IDS", payload: completedConnection });

    // Now we need to move the "movedHandle"
    originalMovedHandle = getHandleById(strayConnection.handles[0]);
    data.movedHandle = {
      id: strayConnection.handles[0],
      positionChange: getPosDifference(originalMovedHandle, newPoints[1]),
    };

    store.dispatch({
      type: "MOVE",
      payload: {
        selection: {
          [types.HANDLE]: [data.movedHandle.id],
        },
        positionChange,
      },
    });
  }

  /**
   * Now here comes all the bullshit
   */
  const listenerId = addListener("mousemove", (currentPosition) => {
    if (!mouseMoved) {
      mouseMoved = true;
      cursorOverrideId = setCursor("PEN", { override: true });

      // Since the mouse moved, we create a new stray connection!
      data.newConnection = {
        id: connectionId,
        points: [pointId, null],
        handles: [handleId, null],
      };
      data.newHandle = {
        x: currentPosition.x,
        y: currentPosition.y,
        id: handleId,
      };

      store.dispatch({ type: "ADD_CONNECTION",  payload: data.newConnection });
      store.dispatch({ type: "ADD_HANDLES",     payload: [data.newHandle] });


      if (opts.strayConnection) {
        /**
         * The mouse moved so we have to discard both of the stray
         * connection handle positions.
         */

        // Moving p1 (movedHandle)
        data.movedHandle.positionChange = getPosDifference(originalMovedHandle, currentPosition);
        store.dispatch({
          type: "MOVE",
          payload: {
            selection: {
              [types.HANDLE]: [data.movedHandle.id],
            },
            positionChange: data.movedHandle.positionChange,
          },
        });

        // Moving p2 (the "newCompletedConnectionHandle").
        const positionChange = getPosDifference(
          data.newCompletedConnectionHandle,
          currentPosition);
  
        store.dispatch({
          type: "MOVE",
          payload: {
            selection: {
              [types.HANDLE]: [data.newCompletedConnectionHandle.id],
            },
            positionChange,
          },
        });
        data.newCompletedConnectionHandle.x = currentPosition.x;
        data.newCompletedConnectionHandle.y = currentPosition.y;
      }
    } else {
      /**
       * Mouse has been moved, so we update a few things.
       */
      const positionChange = getPosDifference(lastPosition, currentPosition);
      store.dispatch({
        type: "MOVE",
        payload: {
          selection: {
            [types.HANDLE]: [handleId],
          },
          positionChange,
        },
      });

      if (opts.handleMirrorId) {
        const handlePos = getHandleById(handleMirrorId)
        store.dispatch({
        type: "MOVE",
        payload: {
          selection: {
            [types.HANDLE]: [handleMirrorId],
          },
          // lol
          positionChange: getPosDifference(handlePos, mirrorPosition(currentPosition, position)),
        },
      });
      }
    }
    
    lastPosition = currentPosition;
  });

  addListener("mouseup", () => {
    removeListener("mousemove", listenerId);

    if (typeof cursorOverrideId === "string") {
      releaseOverride(cursorOverrideId);
      setCursor("DEFAULT");
    }

    const action = {
      type: "ADD_POINT",
      data: {
        id: pointId,
        x: position.x,
        y: position.y,
      },
    };

    if (mouseMoved) {
      action.data.handle = {
        x: lastPosition.x,
        y: lastPosition.y,
        id: handleId,
      };
    }

    addActionToHistory(action, false)
  }, true);
}
