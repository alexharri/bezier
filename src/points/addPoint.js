const { _points } = require("./getPoints");

module.exports = function addPoint(point) {
  if (typeof point !== "object")   { throw new Error("Expected 'point' to be an object."); }
  if (typeof point.x !== "number") { throw new Error("Expected 'x' to be a number."); }
  if (typeof point.y !== "number") { throw new Error("Expected 'y' to be a number."); }

  const id = Math.random().toString();

  _points[id] = point;
  return id;
}