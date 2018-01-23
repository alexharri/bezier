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

module.exports = function onPenConnectPoints(selectedPointId, clickedPointId) {
  const data = {
    selectedPointId,
    clickedPointId,
    connection: {
      id: shortid(),
      points: [selectedPointId, clickedPointId],
      handles: [null, null],
    },
  };

  store.dispatch({
    type: "ADD_CONNECTION",
    payload: data.connection,
  });

  clearSelection();
  addToSelection(types.POINT, clickedPointId);

  let mouseMoved = false;
  let cursorOverrideId;
  let lastPosition;

  const listenerId = addListener("mousemove", (position) => {
    if (!mouseMoved) {
      mouseMoved = true;
      cursorOverrideId = setCursor("PEN", { override: true });
      lastPosition = position;

      const strayConnectionHandleId = shortid();

      data.strayConnection = {
        id: shortid(),
        points: [clickedPointId, null],
        handles: [strayConnectionHandleId, null],
      };
      data.strayConnectionHandle = {
        id: strayConnectionHandleId,
        x: position.x,
        y: position.y,
      };

      store.dispatch({ type: "ADD_CONNECTION",  payload: data.strayConnection });
      store.dispatch({ type: "ADD_HANDLES",     payload: [data.strayConnectionHandle] });

      const origin = getPointById(clickedPointId);

      const [p0, p1, p2, p3] = quadraticToCubicBezier(
        getPointById(selectedPointId),
        null,
        mirrorPosition(position, origin),
        origin);

      data.handles = [p1, p2].map(p => ({
        ...p,
        id: shortid(),
      }));
      data.connection.handles = data.handles.map(x => x.id);

      store.dispatch({
        type: "ADD_HANDLES",
        payload: data.handles,
      });
      store.dispatch({
        type: "REPLACE_CONNECTION_POINT_IDS",
        payload: data.connection,
      })
    } else {
      const origin = getPointById(clickedPointId);
      
      const [p0, p1, p2, p3] = quadraticToCubicBezier(
        getPointById(selectedPointId),
        null,
        mirrorPosition(position, origin),
        origin);

      // Right handle
      store.dispatch({
        type: "MOVE",
        payload: {
          selection: {
            [types.HANDLE]: [data.handles[1].id],
          },
          positionChange: getPosDifference(data.handles[1], p1),
        },
      });
      data.handles[1].x = p1.x;
      data.handles[1].y = p1.y;

      // Left handle
      store.dispatch({
        type: "MOVE",
        payload: {
          selection: {
            [types.HANDLE]: [data.handles[0].id],
          },
          positionChange: getPosDifference(data.handles[0], p2),
        },
      });

      data.handles[0].x = p2.x;
      data.handles[0].y = p2.y;

      // Updating stray connection handle position
      store.dispatch({
        type: "MOVE",
        payload: {
          selection: {
            [types.HANDLE]: [data.strayConnection.handles[0]],
          },
          positionChange: getPosDifference(data.strayConnectionHandle, position),
        },
      });
      data.strayConnectionHandle.x = position.x;
      data.strayConnectionHandle.y = position.y;
    }
  });

  addListener("mouseup", () => {
    removeListener("mousemove", listenerId);

    if (cursorOverrideId) {
      releaseOverride(cursorOverrideId);
      setCursor("DEFAULT");
    }

    addActionToHistory({
      type: "CONNECT_POINTS",
      data,
    }, false);
  }, true);
}
