const { setCursor } = require("../../../utils/cursor");

const splitBezier = require("../../bezier/splitBezier");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const shortid = require("shortid");
const addActionToHistory = require("../../actions/history/addActionToHistory");
const onMoveMouseDown = require("../move/onMoveMouseDown");
const { types, cursors } = require("../../constants");

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
  
    addActionToHistory({
      type: "SPLIT_CONNECTION",
      data: {
        connection,
        newPoints
      },
    }, true);
    setCursor("DEFAULT"); // There will be a point below the mouse
  }

  if (type === types.HANDLE || type === types.POINT) {
    onMoveMouseDown(position, obj);
  }
}