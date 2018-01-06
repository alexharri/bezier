const { addListener, removeListener } = require("../../listeners/listeners");
const setPointPosition = require("../../actions/point/setPointPosition");
const { getPointById } = require("../../points/getPoints");
const { isKeyDown } = require("../../../utils/keyboard");
const { keys } = require("../../constants");
const { setCursor, releaseOverride } = require("../../../utils/cursor");
const addActionToHistory = require("../../actions/history/addActionToHistory");
const { getPointHandleIds } = require("../../points/getPoints");
const store = require("../../store");
const {
  getSelectedOfType,
  removeFromSelection,
  isSelected,
  clearSelection,
  addToSelection,
} = require("../../selection");

const getPosDifference = (oldPos, newPos) => ({
  x: newPos.x - oldPos.x,
  y: newPos.y - oldPos.y,
});

module.exports = function onPointMouseDown(initialPoint) {
  const { id } = initialPoint;
  const initialPosition = {
    x: initialPoint.x,
    y: initialPoint.x,
  }

  const wasInitiallySelected = isSelected("__POINT", id);
  let mouseMoved = false;
  let overrideId;

  const listenerId = addListener("mousemove", (newPosition) => {
    if (!mouseMoved) {
      overrideId = setCursor("MOVE", { override: true });
    }

    mouseMoved = true;
    const point = getPointById(id);
    const positionChange = getPosDifference(point, newPosition);

    const pointIds = getSelectedOfType("__POINT");

    // Moving the points
    store.dispatch({
      type: "SET_POINT_POSITION",
      payload: {
        ids: pointIds,
        positionChange,
      },
    });

    // Moving the handles
    for (let i = 0; i < pointIds.length; i += 1) {
      store.dispatch({
        type: "SET_HANDLE_POSITION",
        payload: {
          ids: getPointHandleIds(pointIds[i]),
          positionChange,
        },
      });
    }
  });


  addListener("mouseup", () => {
    removeListener("mousemove", listenerId);

    // Releasing the cursor override.
    if (typeof overrideId === "string") {
      releaseOverride(overrideId);
    }

    // If point was selected and the mouse was not moved
    if (wasInitiallySelected && !mouseMoved) {
      if (isKeyDown(keys.SHIFT)) {
        // We remove the point from the selection if the shift key was down
        removeFromSelection("__POINT", id);
      } else {
        /**
         * Remove everything but the point from the selection if the
         * shift key was not down.
         */
        clearSelection();
        addToSelection("__POINT", id);
      }
    }

    /**
     * Create new action.
     */
    if (mouseMoved) {
      const { x, y } = getPointById(id);
      const ids = getSelectedOfType("__POINT");
      addActionToHistory({
        type: "MOVE_POINT_AND_HANDLES",
        data: {
          ids,
          positionChange: getPosDifference(initialPoint, { x, y }),
        },
      }, false);
    }
  }, true);
}