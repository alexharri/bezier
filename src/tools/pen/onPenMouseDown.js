const { isKeyDown } = require("../../utils/keyboard");
const { setCursor } = require("../../utils/cursor");
const splitBezier = require("../../bezier/splitBezier");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const shortid = require("shortid");
const addActionToHistory = require("../../actions/history/addActionToHistory");
const onMoveMouseDown = require("../move/onMoveMouseDown");
const { types, cursors, keys } = require("../../constants");
const {
  addToSelection,
  clearSelection,
  isSelected,
  removeFromSelection,
} = require("../../selection");

module.exports = function onPenMouseDown(position, obj) {
  if (!obj) {
    return;
  }

  const { value, type } = obj;

  if (type === types.CONN) {
    const { connection, closestPoint } = value;
    const { t } = closestPoint; // t is where we split the path
  
    const newPoints = splitBezier(getConnectionPoints(connection), t);
  
    for (let i = 0; i < newPoints.length; i += 1) {
      newPoints[i].id = shortid();
    }
  
    // p2 and p4 will be siblings
    newPoints[2].sibling = newPoints[4].id;
    newPoints[4].sibling = newPoints[2].id;

    // Selecting the new point
    clearSelection();
    addToSelection(types.POINT, newPoints[3].id);

    addActionToHistory({
      type: "SPLIT_CONNECTION",
      data: {
        connection,
        newPoints
      },
    }, true);
    setCursor("DEFAULT"); // There will be a point below the mouse
  }

  if (type === types.HANDLE) {
    onMoveMouseDown(position, obj);
  }

  if (type === types.POINT) {
    if (!isKeyDown(keys.SHIFT)) {
      clearSelection();
    }
    if (!isSelected(types.POINT, value.id)) {
      addToSelection(types.POINT, value.id);
    }
  }
}