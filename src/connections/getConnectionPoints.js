const { getPointById } = require("../points/getPoints");

module.exports = function getConnectionPoints(c) {
  return [
    getPointById(c.points[0]),
    c.handles[0],
    c.handles[1],
    getPointById(c.points[1]),
  ];
}
