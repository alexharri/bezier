const { getHandleById } = require("../../handles/getHandles");
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

module.exports = function onHandleMouseDown(initialPoint) {
  const { id } = initialPoint;
  const initialPosition = {
    x: initialPoint.x,
    y: initialPoint.x,
  }

  const wasInitiallySelected = isSelected("__HANDLE", id);
  let mouseMoved = false;
  let overrideId;

  const listenerId = addListener("mousemove", (newPosition) => {
    if (!mouseMoved) {
      overrideId = setCursor("MOVE", { override: true });
    }

    mouseMoved = true;
    const handle = getHandleById(id);
    const positionChange = getPosDifference(handle, newPosition);

    // Moving the handles
    store.dispatch({
      type: "SET_HANDLE_POSITION",
      payload: {
        ids: getSelectedOfType("__HANDLE"),
        positionChange,
      },
    });
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
        removeFromSelection("__HANDLE", id);
      } else {
        /**
         * Remove everything but the point from the selection if the
         * shift key was not down.
         */
        clearSelection();
        addToSelection("__HANDLE", id);
      }
    }

    /**
     * Create new action.
     */
    if (mouseMoved) {
      const { x, y } = getHandleById(id);
      addActionToHistory({
        type: "SET_HANDLE_POSITION",
        data: {
          ids: getSelectedOfType("__HANDLE"),
          positionChange: getPosDifference(initialPoint, { x, y }),
        },
      }, false);
    }
  }, true);
}