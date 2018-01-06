const store = require("../store");
const { getAllConnections } = require("../connections/getConnections");
const calcDistanceBetweenPositions = require("../../utils/calcDistanceBetweenPositions");

/**
 * Returns a point with a specific id
 *
 * Returns null if no point has said id.
 */
exports.getPointById = function getPointById(id) {
  if (!id || typeof id !== "string") {
    throw new Error(`Invalid id. Expected string but got '${id}'`);
  }

  const { points } = store.getState();

  return points[id] || null;
}

/**
 * Returns an array of all current points
 */
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

/**
 * Returns the point closest to the given position.
 *
 * Returns null if no point is closer than 15px
 */
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

/**
 * Returns an array with the ids of every handle that is
 * connected to that point.
 */
exports.getPointHandleIds = function getPointHandleIds(id) {
  const connections = getAllConnections();
  const handles = [];

  for (let i = 0; i < connections.length; i += 1) {
    const pointIndex = connections[i].points.indexOf(id);
    if (pointIndex > -1) {
      handles.push(connections[i].handles[pointIndex]);
    }
  }

  return handles;
}

exports.getAllPoints = getAllPoints;