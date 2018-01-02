const calcBezierPointAt = require("./calcBezierPointAt");
const calcDistanceBetweenPositions = require("../../utils/calcDistanceBetweenPositions");
const getIntermediateNumber = require("../../utils/getIntermediateNumber");
const getPointsBetween = require("./getPointsBetween");

const numApproxPoints = 30;

/**
 * Finds the closest point from a position to the bezier curve that
 * represents the connection.
 *
 * If the closest point is over 20px away null is returned.
 *
 * Else it returns an point.
 */
module.exports = function getClosestPointOnConnection(c, position) {
  let closestApprox;
  let secondApprox;

  /**
   * Finding the initial approximation points
   */
  for (let i = 0; i < numApproxPoints; i += 1) {
    const t = i / (numApproxPoints - 1);
    const bezierPoint = calcBezierPointAt(c, getIntermediateNumber(0, 1, t));

    const distance = calcDistanceBetweenPositions(position, bezierPoint);
    const point = {
      x: bezierPoint.x,
      y: bezierPoint.y,
      distance,
      t,
    };

    if (!closestApprox || (distance < closestApprox.distance)) {
      secondApprox = closestApprox;
      closestApprox = point;
    } else if (!secondApprox || (distance < secondApprox.distance)) {
      secondApprox = point;
    }
  }

  if (closestApprox.distance > 100) { // 10px
    return null;
  }

  const points = getPointsBetween(c, 20, closestApprox.t, secondApprox.t);
  let closestPoint;

  for (let i = 0; i < points.length; i += 1) {
    const distance = calcDistanceBetweenPositions(position, points[i]);
    if (!closestPoint || (distance < closestPoint.distance)) {
      closestPoint = {
        x: points[i].x,
        y: points[i].y,
        t: points[i].t,
        distance,
      };
    }
  }

  return closestPoint;
}