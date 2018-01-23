const { getGuidesOfType } = require("../guides");
const getContext = require("../../canvas/getContext");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const { getAllConnections } = require("../../connections/getConnections");
const renderHandles = require("./renderHandles");
const { renderLine, renderCubicBezier, renderQuadraticBezier } = require("../primitives");
const { types, colors } = require("../../constants");


module.exports = function renderConnections() {
  const connections = getAllConnections();
  for (let i = 0; i < connections.length; i += 1) {
    const points = getConnectionPoints(connections[i]);
    if (points.indexOf(null) === -1) { // All points exist
      renderCubicBezier(points);
    } else if (points[0] && points[3]) { // Not a stray connection
      // Straight line
      if (!points[1] && !points[2]) {
        renderLine(points[0], points[3]);
      } else { // 3 points exist
        renderQuadraticBezier(points.filter(p => p)); // Will have 3 points
      }
    }

    // Drawing the handles (and handle lines)
    renderHandles(connections[i]);
  }

  getGuidesOfType(types.CONN).forEach((guide) => {
    renderCubicBezier(guide, 1, colors.PRIMARY);
  });

  getGuidesOfType(types.LINE).forEach((line) => {
    const ctx = getContext();

    renderLine(line.from, line.to, colors.PRIMARY, 1);
  });
}