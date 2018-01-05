const resolveAction = require("../resolveAction");
const store = require("../../store");
const render = require("../../render/render");

module.exports = function undo() {
  const { history } = store.getState().history;
  if (!history.length) {
    return;
  }

  const action = history[history.length - 1];
  resolveAction(action, { undo: true });
  
  store.dispatch({ type: "UNDO" });
  render(null, { useLastPosition: true });
}
