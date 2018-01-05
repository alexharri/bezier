const store = require("../store");
const setPointPosition = require("./point/setPointPosition");

const actions = Object.freeze({
  SET_POINT_POSITION: setPointPosition,
});

// 'which' is either undo or redo
function resolveActionCreator(type, undo) {
  if (!actions[type]) {
    throw new Error(`Could not find action of type '${type}'.`);
  }

  const undoOrRedo = undo ? "undo" : "redo";

  if (typeof actions[type] === "function") {
    return actions[type];
  } else if (typeof actions[type] === "object") {
    if (typeof actions[type][undoOrRedo] !== "function") {
      throw new Error(`Invalid action creator of type: '${type}'. Could not '${undoOrRedo}'.`);  
    }
    return actions[type][undoOrRedo];
  }

  throw new Error(`Invalid action creator of type: '${type}'.`);
}

module.exports = function resolveAction({ type, data, selection }, opts = {}) {
  if (!opts || typeof opts !== "object") {
    throw new Error(`Invalid options. Expected object but got '${opts}'.`);
  }

  const actionCreator = resolveActionCreator(type, opts.undo || false);

  if (!opts.ignoreSelection) {
    store.dispatch({
      type: "SET_SELECTION",
      value: selection,
    });
  }
  store.dispatch(actionCreator(data));
}
