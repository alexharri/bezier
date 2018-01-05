const store = require("../store");
const calcDistanceBetweenPositions = require("../../utils/calcDistanceBetweenPositions");

exports.getPointById = function getPointById(id) {
  if (!id || typeof id !== "string") {
    throw new Error(`Invalid id. Expected string but got '${id}'`);
  }

  const { points } = store.getState();

  return points[id] || null;
}

function getAllPoints() {
  const { points } = store.getState();

  const pArr = [];
  const keys = Object.keys(points);
  for (let i = 0; i < keys.length; i += 1) {
    const { x, y } = points[keys[i]];
    pArr.push({ x, y, id: keys[i] });
  }
  return pArr;
}

exports.getPointAtPosition = function getPointAtPosition(position) {
  const points = getAllPoints();
  let closestPoint;
  let pointDistance;

  for (let i = 0; i < points.length; i += 1) {
    const distance = calcDistanceBetweenPositions(position, points[i]);
    if (!closestPoint || distance < pointDistance) {
      closestPoint = points[i];
      pointDistance = distance;
    }
  }

  return pointDistance < 225 ? closestPoint : null; // 15px
}

exports.getAllPoints = getAllPoints;