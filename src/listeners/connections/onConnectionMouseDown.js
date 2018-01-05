const splitBezier = require("../../bezier/splitBezier");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const shortid = require("shortid");
const render = require("../../render/render");
const splitConnection = require("../../actions/connection/splitConnection");
const addActionToHistory = require("../../actions/history/addActionToHistory");

module.exports = function onConnectionMouseDown({ connection, closestPoint }) {
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