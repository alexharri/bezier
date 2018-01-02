const calcDistanceBetweenPositions = require("../../utils/calcDistanceBetweenPositions");

const points = {
  "a": {
    x: 40,
    y: 40,
  },
  "b": {
    x: 400,
    y: 200,
  },
};
exports._points = points;

exports.getPointById = function getPointById(id) {
  if (!id || typeof id !== "string") {
    throw new Error(`Invalid id. Expected string but got '${id}'`);
  }

  return points[id] || null;
}

function getAllPoints() {
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
  for (let i = 0; i < points.length; i += 1) {
    const distance = calcDistanceBetweenPositions(position, points[i]);
    if (distance < 400) { // 20px
      return {
        type: "__POINT",
        value: points[i],
      };
    }
  }
  return null;
}

exports.getAllPoints = getAllPoints;