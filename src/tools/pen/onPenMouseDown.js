const splitBezier = require("../../bezier/splitBezier");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const shortid = require("shortid");
const render = require("../../render/render");
const splitConnection = require("../../actions/connection/splitConnection");
const addActionToHistory = require("../../actions/history/addActionToHistory");
const toPosition = require("../../../utils/toPosition");
const resolveObjectAtPosition = require("../../resolve/resolveObjectAtPosition");
const { types } = require("../../constants");

module.exports = function onConnectionMouseDown(e) {
  const position = toPosition(e);

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

  console.log(type);
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
    render(closestPoint);
  }
}