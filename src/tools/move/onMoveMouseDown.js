const { runListeners } = require("../../listeners/listeners");
const toPosition = require("../../../utils/toPosition");
const resolveObjectAtPosition = require("../../resolve/resolveObjectAtPosition");
const resolveObjectId = require("../../resolve/resolveObjectId");
const { isKeyDown } = require("../../../utils/keyboard");
const { keys, types } = require("../../constants");
const render = require("../../render/render");
const { addListener, removeListener } = require("../../listeners/listeners");
const { setCursor, releaseOverride } = require("../../../utils/cursor");
const store = require("../../store");
const addActionToHistory = require("../../actions/history/addActionToHistory");
const addImplicitlySelectedObjects = require("./addImplicitlySelectedObjects");
const {
  clearSelection,
  addToSelection,
  isSelected,
  copySelection,
  removeFromSelection,
} = require("../../selection");

const getPosDifference = (oldPos, newPos) => ({
  x: newPos.x - oldPos.x,
  y: newPos.y - oldPos.y,
});

module.exports = function resolveMoveMouseDown(e) {
  const initialPosition = toPosition(e);

  const obj = resolveObjectAtPosition(initialPosition);
  if (!obj) {
    /**
     * Simply clear the selection
     */
    clearSelection();
    render(initialPosition);
    return;
  }


  const { value, type } = obj;
  
  const objectId = resolveObjectId(type, value);
  const wasSelectedBeforeClick = isSelected(type, objectId);
  
  let mouseMoved = false;
  let cursorOverrideId;
  let lastPosition = initialPosition;
  let selection;

  /**
   * Runs whilst the mouse is down, incrementally updates the
   * position of all selected objects
   */
  const listenerId = addListener("mousemove", (currentPosition) => {
    if (!mouseMoved) {
      mouseMoved = true;
      cursorOverrideId = setCursor("MOVE", { override: true });
    }

    // Moving the objects
    store.dispatch({
      type: "MOVE",
      payload: {
        selection,
        positionChange: getPosDifference(lastPosition, currentPosition),
      },
    });
    lastPosition = currentPosition;
  });

  /**
   * Runs when the mouse is released.
   *
   * Removes the mousemove listener above and creates a new action that
   * moves the current selection between the initial and last position.
   *
   * Does not create an action if the mouse was not moved.
   */
  addListener("mouseup", () => {
    removeListener("mousemove", listenerId);

    // Releasing the cursor override.
    if (typeof cursorOverrideId === "string") {
      releaseOverride(cursorOverrideId);
    }

    // Creates the move action if the mouse was moved
    if (mouseMoved) {
      addActionToHistory({
        type: "MOVE",
        data: {
          selection,
          positionChange: getPosDifference(initialPosition, lastPosition),
        },
      }, false);
    }

    if (!mouseMoved && wasSelectedBeforeClick) {
      if (isKeyDown(keys.SHIFT)) {
        // We remove the object from the selection if the shift key was down
        removeFromSelection(type, objectId);
      } else {
        /**
         * Remove everything but the object from the selection if the
         * shift key was not down.
         */
        clearSelection();
        addToSelection(type, objectId);
      }
    }
  }, true);


  /**
   * The object clicked on will be selected, but if the
   * shift key was not down, then we remove all other objects.
   */
  if (!wasSelectedBeforeClick) {
    if (!isKeyDown(keys.SHIFT)) {
      clearSelection();
    }
    addToSelection(type, objectId);
  }

  selection = addImplicitlySelectedObjects(copySelection());

  render(initialPosition);
}