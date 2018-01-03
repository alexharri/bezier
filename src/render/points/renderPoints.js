const { getSelectedOfType } = require("../../selection");
const { getAllPoints } = require("../../points/getPoints");
const { renderCircle } = require("../primitives");

const pointRadius = 5;


module.exports = function renderPoints() {
  const points = getAllPoints();
  const selectedPoints = getSelectedOfType("__POINT");
  for (let i = 0; i < points.length; i += 1) {
    if (selectedPoints.indexOf(points[i].id) > -1) {
      renderCircle(points[i], pointRadius, "red");
    } else {
      renderCircle(points[i], pointRadius, "blue", { color: "green", width: 5 });
    }
  }
}
