/**
 * An action is composed of three properties.
 *
 *    type - The name of the action, used to resolve the action creator
 *    data - Passed to the action creator
 *    selection - The selection to restore when the action is executed
 *
 * An action may return af array of actions to execute.
 *
 * A top level action must have a selection, but sub-actions should not.
 *
 * Every action creator should be able to execute and reverse itself given
 * those three properties.
 */

const store = require("../store");
const actions = require("./actions");
const { isValidSelection, clearSelection } = require("../selection");

/**
 * Fetches the appropriate action creator for the type provided.
 *
 * Each action creator module should have a redo and undo
 * export with a function that takes in an action and returns
 * a dispatchable object.
 */
function resolveActionCreator(type, undo) {
  if (!actions[type]) {
    throw new Error(`Could not find action of type '${type}'.`);
  }

  const undoOrRedo = undo ? "undo" : "redo";

  if (typeof actions[type] === "object") {
    if (typeof actions[type][undoOrRedo] !== "function") {
      throw new Error(`Invalid action creator of type: '${type}'. Could not '${undoOrRedo}'.`);  
    }
    return actions[type][undoOrRedo];
  } else if (typeof actions[type] === "function") {
    /**
     * Higher order action creator. It returns an array of actions.
     *
     * Higher order action creators can't be flipped, but the actions
     * creators that they return can be.
     */
    return actions[type];
  }

  throw new Error(`Invalid action creator of type: '${type}'.`);
}

function resolveNestedAction(actions, undo) {
  for (let i = 0; i < actions.length; i += 1) {
    const { type, data } = actions[i];
  
    const actionCreator = resolveActionCreator(type, undo);
    const result = actionCreator(data);

    if (Array.isArray(result)) {
      resolveNestedAction(result, undo); // oh boy
    } else {
      store.dispatch(result);
    }
  }
}

/**
 * Predominantly used by the undo/redo mechanism.
 *
 * Takes in an action and executes or reverses that action depending
 * on the options passed.
 *
 * Options:
 *    undo            - if set to true, the action is reversed.
 *    ignoreSelection - if set to true, the current selection is not
 *                      modified whatsoever.
 *
 * ignoreSelection should exclusively be used by the addActionToHistory
 * module.
 */
module.exports = function resolveAction(action, opts = {}) {
  if (!opts || typeof opts !== "object") {
    throw new Error(`Invalid options. Expected object but got '${opts}'.`);
  }

  const { type, data, selection } = action;
  const undo = opts.undo || false;

  const actionCreator = resolveActionCreator(type, undo);
  const result = actionCreator(data);
  
  if (Array.isArray(result)) {
    resolveNestedAction(result, undo);
  } else {
    store.dispatch(result);
  }

  if (!opts.ignoreSelection) {
    if (undo) {
      /**
       * On object creation, those objects will be selected.
       *
       * If we're undoing an object creation, then the selection will
       * contain objects that don't exist.
       *
       * If this is the case, we restore the selection of the action before
       * if it exists, otherwise we clear the selection.
       */
      if (!isValidSelection(selection)) {
        const { history } = store.getState().history;
        if (!history.length) {
          clearSelection();
        } else {
          const actionBefore = history[history.length - 1];
          store.dispatch({
            type: "RESTORE_SELECTION",
            payload: actionBefore.selection,
          });
        }
      }
    } else {
      store.dispatch({
        type: "RESTORE_SELECTION",
        payload: selection,
      });
    }
  }
}
