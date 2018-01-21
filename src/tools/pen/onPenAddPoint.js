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
const quadraticToCubicBezier = require("../../bezier/quadraticToCubicBezier");
const { getPointById } = require("../../points/getPoints");
const { types } = require("../../constants");

const defaultOpts = {
  strayConnection: null,
  selectedPoint: null,
};

module.exports = function onPenAddPoint(position, opts = defaultOpts) {
  if (!isValidPosition(position)) {
    throw new Error("Invalid position.");
  }

  /**
   * This data object will later be passed into the "ADD_PEN_POINT"
   * action, which has a lot of optional functionality.
   */
  const data = {};

  const pointId = shortid();
  data.point = {
    id: pointId,
    x: position.x,
    y: position.y,
  };

  store.dispatch({ type: "ADD_POINT", payload: data.point });

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
    data.strayConnection = strayConnection;

    const newPoints = quadraticToCubicBezier(
      getPointById(strayConnection.points[0]),
      getHandleById(strayConnection.handles[0]),
      null,
      position);

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
      points:   [strayConnection.points[0],   data.point.id],
      handles:  [strayConnection.handles[0],  data.newCompletedConnectionHandle.id],
    };

    store.dispatch({ type: "ADD_HANDLES", payload: [data.newCompletedConnectionHandle] });
    store.dispatch({ type: "REPLACE_CONNECTION_POINT_IDS", payload: data.completedConnection });

    // Now we need to move the "movedHandle"
    originalMovedHandle = getHandleById(strayConnection.handles[0]);
    const positionChange = getPosDifference(originalMovedHandle, newPoints[1]);
    data.movedHandle = {
      id: strayConnection.handles[0],
      positionChange,
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
  } else if (opts.selectedPoint) {
    /**
     * This means that there's not a stray connection, but a single
     * point is selected.
     *
     * This means that we're creating a new connection with no p0 handle.
     */

    // The connection between the selectedPoint and the new
    data.lineConnection = {
      id: shortid(),
      points: [opts.selectedPoint, pointId],
      handles: [null, null],
    }

    store.dispatch({ type: "ADD_CONNECTION", payload: data.lineConnection });
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
        data.movedHandle.positionChange = getPosDifference(strayConnectionPoints[1], originalMovedHandle);
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
      } else if (data.lineConnection) {
        data.lineConnectionHandle = {
          id: shortid(),
          x: currentPosition.x,
          y: currentPosition.y,
        };
        data.lineConnection.handles = [null, data.lineConnectionHandle.id];
        store.dispatch({ type: "ADD_HANDLES", payload: [data.lineConnectionHandle] });
        console.log(data.lineConnection)
        store.dispatch({ type: "REPLACE_CONNECTION_POINT_IDS", payload: data.lineConnection })
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

      if (opts.strayConnection || data.lineConnectionHandle) {
        const which = (opts.strayConnection
          ? "newCompletedConnectionHandle"
          : "lineConnectionHandle");

        const handlePos = data[which];
        const handleMirrorId = data[which].id;
        const newPosition = mirrorPosition(currentPosition, position);
        store.dispatch({
          type: "MOVE",
          payload: {
            selection: {
              [types.HANDLE]: [handleMirrorId],
            },
            // lol
            positionChange: getPosDifference(handlePos, newPosition),
          },
        });
        data[which].x = newPosition.x;
        data[which].y = newPosition.y;
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
      type: "ADD_PEN_POINT",
      data,
    };

    addActionToHistory(action, false, {
      undoSelection: {
        [types.POINT]: [opts.selectedPoint],
      }
    });
  }, true);
}
