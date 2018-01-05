const resolveAction = require("../resolveAction");
const store = require("../../store");
const render = require("../../render/render");

module.exports = function redo() {
  const { future } = store.getState().history;
  if (!future.length) {
    return;
  }

  const action = future[future.length - 1];
  resolveAction(action, { undo: false });
  
  store.dispatch({ type: "REDO" });
  render(null, { useLastPosition: true });
}
