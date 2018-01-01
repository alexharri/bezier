const getIntermediateNumber = require("../../utils/getIntermediateNumber");
const calcBezierPointAt = require("./calcBezierPointAt");

/**
 * c is the connection.
 * n is the number of points.
 * tStart is the t value of the first point.
 * tEnd is the t value of the last point.
 */
module.exports = function getPointsBetween(c, n, tStart, tEnd) {
  const points = [];

  for (let i = 0; i < n; i += 1) {
    const t = getIntermediateNumber(tStart, tEnd, (i / n));
    const point = calcBezierPointAt(c, t);
    points.push(point);
  }

  return points;
}
