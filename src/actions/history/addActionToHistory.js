const store = require("../../store");
const { copySelection } = require("../../selection");
const resolveAction = require("../resolveAction");

/**
 * An action passed needs to have two properties.
 *    - type => to find the action creator
 *    - data => what to pass to the action creator
 * 
 * We get the third property ourselves
 *    - selection => the selection state at that point in history
 *
 * The redo part of the action is executed by defaut before the
 * action is added to the history. This can be disabled by setting
 * executeImmediately to false.
 */
module.exports = function addAction(action, executeImmediately = true) {
  if (!action || typeof action !== "object") {
    throw new Error(`Invalid action. Expected object but got '${action}'.`);
  }
  
  if (!action.type || typeof action.type !== "string") {
    throw new Error(`Invalid type. Expected string but got '${action.type}'.`);
  }

  if (typeof action.data === "undefined") {
    throw new Error(`Invalid data. Expected any but got '${action.data}'.`);
  }

  action.selection = copySelection();

  if (executeImmediately) {
    resolveAction(action, { ignoreSelection: true });
  }
  store.dispatch({
    type: "ADD_ACTION_TO_HISTORY",
    payload: action,
  });
}
