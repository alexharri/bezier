const { getAllPoints } = require("../../points/getPoints");
const { renderCircle } = require("../primitives");

const renderPoint = point => renderCircle(point, 8, "blue");

module.exports = function renderPoints() {
  const points = getAllPoints();
  for (let i = 0; i < points.length; i += 1) {
    renderPoint(points[i]);
  }
}