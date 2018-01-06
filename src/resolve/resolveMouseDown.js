const { runListeners } =  require("../listeners/listeners");
const toPosition = require("../../utils/toPosition");
const resolveObjectAtPosition = require("./resolveObjectAtPosition");
const { clearSelection, addToSelection, isSelected } = require("../selection");
const { isKeyDown } = require("../../utils/keyboard");
const { keys } = require("../constants");
const render = require("../render/render");

const __CONNECTION  = require("../listeners/connections/onConnectionMouseDown");
const __HANDLE      = require("../listeners/handles/onHandleMouseDown");
const __POINT       = require("../listeners/points/onPointMouseDown");

const listeners = {
  __HANDLE,
  __POINT,
  __CONNECTION,
};

const getObjectId = {
  __HANDLE: ({ id }) => id,
  __POINT: ({ id }) => id,
  __CONNECTION: ({ connection }) => connection.id,
}

module.exports = function resolveMouseDown(e) {
  const position = toPosition(e);
  runListeners("mousedown", position);

  const obj = resolveObjectAtPosition(position);
  if (!obj) {
    /**
     * Nothing to interact with.
     *
     * In the future, a few functions depending on the tool used
     * should be invoked.
     *
     * For example
     *  - Pen tool  => New vector point
     *  - Select    => Square select
     */
    clearSelection();
    render(position);
    return;
  }

  const { value, type } = obj;

  const objectId = getObjectId[type](value);

  /**
   * Runs the appropriate listeners for the object of this type.
   *
   * Listeners must be set before selection is mutated because they
   * depend on the selection state.
   */
  if (listeners[type]) {
    listeners[type](value);
  }

  /**
   * We reset the selection if the following cases are true:
   *
   *  - The shift key is not being held
   *    AND the object was not selected before mousedown.
   *
   *  - The object (when selected) was clicked on (mousedown and mouseup)
   *    without moving the mouse
   *
   * The latter is checked by the listeners set above
   */
  if (!isSelected(type, objectId) && !isKeyDown("Shift")) {
    clearSelection();
  }

  if (!isSelected(type, objectId)) {
    addToSelection(type, objectId);
  }

  render(position);
}