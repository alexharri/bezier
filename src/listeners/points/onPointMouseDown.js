const { addListener, removeListener } = require("../../listeners/listeners");
const setPointPosition = require("../../points/setPointPosition");
const { getPointById } = require("../../points/getPoints");
const { isKeyDown } = require("../../../utils/keyboard");
const { keys } = require("../../constants");
const {
  getSelectedOfType,
  removeFromSelection,
  isSelected,
  clearSelection,
  addToSelection,
} = require("../../selection");

module.exports = function onPointMouseDown({ id }) {
  const wasInitiallySelected = isSelected("__POINT", id);
  let mouseMoved = false;

  const listenerId = addListener("mousemove", (newPosition) => {
    mouseMoved = true;
    const point = getPointById(id);
    const positionChange = {
      x: newPosition.x - point.x,
      y: newPosition.y - point.y,
    };

    const activePoints = getSelectedOfType("__POINT");
    for (let i = 0; i < activePoints.length; i += 1) {
      const { x, y } = getPointById(activePoints[i]);
      setPointPosition(activePoints[i], {
        x: x + positionChange.x,
        y: y + positionChange.y,
      });
    }
  });


  addListener("mouseup", () => {
    removeListener("mousemove", listenerId);
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
  }, true);
}