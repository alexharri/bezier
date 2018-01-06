const { getSelectedOfType } = require("../../selection");
const { getAllPoints } = require("../../points/getPoints");
const { renderCircle } = require("../primitives");
const { colors } = require("../../constants");

module.exports = function renderPoints() {
  const points = getAllPoints();
  const selectedPoints = getSelectedOfType("__POINT");
  for (let i = 0; i < points.length; i += 1) {
    const isPointSelected = selectedPoints.indexOf(points[i].id) > -1;
    if (isPointSelected) {
      renderCircle(points[i], 5, colors.WHITE, { color: colors.PRIMARY, width: 2 });
    } else {
      renderCircle(points[i], 4, colors.PRIMARY);
    }
  }
}
