const render = require("../src/render/render");
const { copySelection, _pasteSelection } = require("./selection");

const history = []; // Actions that the user can undo
const future = []; // Actions that the user can redo

exports.undo = function undo() {
  if (!history.length) {
    return;
  }
  console.log("UNDO");

  const action = history.pop();
  future.push(action);
  
  action.undo();
  _pasteSelection(action.selection);
  render(null, { useLastPosition: true });
}

exports.redo = function redo() {
  if (!future.length) {
    return;
  }
  console.log("REDO");

  const action = future.pop();
  history.push(action);
  
  action.redo();
  _pasteSelection(action.selection);
  render(null, { useLastPosition: true });
}
